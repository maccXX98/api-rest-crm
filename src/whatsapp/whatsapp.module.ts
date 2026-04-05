import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { WebhookSignatureGuard } from './guards/webhook-signature.guard';
import { WhatsAppWebhookHealthCheck } from './whatsapp-webhook-health.check';
import { MessageLogModule } from '../message-log/message-log.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MessageLogModule,
    BullModule.registerQueue({
      name: 'whatsapp-inbound',
    }),
  ],
  controllers: [WhatsAppController],
  providers: [
    WhatsAppService,
    WebhookSignatureGuard,
    WhatsAppWebhookHealthCheck,
  ],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
