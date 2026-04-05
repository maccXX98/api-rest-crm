import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { MessageLog } from './entities/message-log.entity';
import { MessageDirection } from './entities/message-log.entity';
import { RedisClientProvider } from './redis-client.provider';

@Injectable()
export class MessageLogService {
  private readonly logger = new Logger(MessageLogService.name);
  private readonly IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60; // 24 hours

  constructor(
    @InjectRepository(MessageLog)
    private messageLogRepository: Repository<MessageLog>,
    @Inject(RedisClientProvider)
    private redisProvider: RedisClientProvider,
  ) {}

  async logInbound(
    phone: string,
    messageType: string,
    content: string | null,
    waMessageId: string,
    waMessageTimestamp: string,
    rawPayload: unknown,
  ): Promise<MessageLog> {
    // Fast idempotency check via Redis
    const redisKey = `wa:msg:id:${waMessageId}`;
    const alreadyProcessed = await this.redisProvider.client.set(
      redisKey,
      '1',
      'EX',
      this.IDEMPOTENCY_TTL_SECONDS,
      'NX',
    );

    if (alreadyProcessed === null) {
      // Key already existed — message already processed
      this.logger.debug(
        `Message ${waMessageId} already processed (idempotency hit)`,
      );
      const existing = await this.messageLogRepository.findOne({
        where: { waMessageId },
      });
      return existing;
    }

    // Persist to PostgreSQL
    const log = this.messageLogRepository.create({
      direction: MessageDirection.INBOUND,
      phone,
      messageType,
      content,
      waMessageId,
      waMessageTimestamp,
      rawPayload: rawPayload as Record<string, unknown>,
    });

    const saved = await this.messageLogRepository.save(log);
    this.logger.log(`Logged inbound message ${waMessageId} from ${phone}`);
    return saved;
  }

  async logOutbound(
    phone: string,
    messageType: string,
    content: string | null,
  ): Promise<MessageLog> {
    const log = this.messageLogRepository.create({
      direction: MessageDirection.OUTBOUND,
      phone,
      messageType,
      content,
    });

    return this.messageLogRepository.save(log);
  }

  async findByPhone(phone: string, limit = 20): Promise<MessageLog[]> {
    return this.messageLogRepository.find({
      where: { phone },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async existsByWaMessageId(waMessageId: string): Promise<boolean> {
    // Fast path: check Redis
    const exists = await this.redisProvider.client.exists(
      `wa:msg:id:${waMessageId}`,
    );
    if (exists) return true;

    // Fallback: check PostgreSQL
    const count = await this.messageLogRepository.count({
      where: { waMessageId },
    });
    return count > 0;
  }
}
