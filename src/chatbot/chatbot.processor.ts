import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ChatbotService } from './chatbot.service';
import { MessageLogService } from '../message-log/message-log.service';
import { extractText } from './helpers/extract-text';
import { WebhookMessage } from '../whatsapp/interfaces/webhook-payload.interface';
import { Conversation } from './entities/conversation.entity';

export interface InboundMessageJob {
  phone: string;
  message: WebhookMessage;
  raw: unknown;
  waMessageTimestamp: string;
}

@Processor('whatsapp-inbound')
export class ChatbotProcessor extends WorkerHost {
  private readonly logger = new Logger(ChatbotProcessor.name);

  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly messageLogService: MessageLogService,
  ) {
    super();
  }

  async process(job: Job<InboundMessageJob>): Promise<void> {
    const { phone, message, raw, waMessageTimestamp } = job.data;

    this.logger.debug(
      `Processing job ${job.id}: message ${message.id} from ${phone}`,
    );

    // 1. Idempotency check
    const alreadyProcessed = await this.messageLogService.existsByWaMessageId(
      message.id,
    );
    if (alreadyProcessed) {
      this.logger.debug(`Message ${message.id} already processed, skipping`);
      return;
    }

    // 2. Log inbound (rawPayload preserved!)
    await this.messageLogService.logInbound(
      phone,
      message.type,
      extractText(message),
      message.id,
      waMessageTimestamp,
      raw,
    );

    // 3. Get or create conversation
    const conversation =
      await this.chatbotService.getOrCreateConversation(phone);

    // 4. Handle stale messages (out-of-order)
    if (this.isStaleMessage(message, conversation)) {
      this.logger.debug(`Stale message ${message.id}, ignoring`);
      return;
    }

    // 5. Route to state machine
    await this.chatbotService.processMessage(phone, message, conversation);
  }

  private isStaleMessage(
    message: WebhookMessage,
    conversation: Conversation,
  ): boolean {
    if (!conversation.lastWaMessageTimestamp) return false;
    return (
      BigInt(message.timestamp) < BigInt(conversation.lastWaMessageTimestamp)
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.debug(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error): void {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
