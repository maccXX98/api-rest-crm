import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisClientProvider implements OnModuleDestroy {
  readonly client: Redis;

  constructor(configService: ConfigService) {
    this.client = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
