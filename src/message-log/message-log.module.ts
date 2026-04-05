import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageLogService } from './message-log.service';
import { MessageLog } from './entities/message-log.entity';
import { RedisClientProvider } from './redis-client.provider';

@Module({
  imports: [TypeOrmModule.forFeature([MessageLog])],
  providers: [MessageLogService, RedisClientProvider],
  exports: [MessageLogService],
})
export class MessageLogModule {}
