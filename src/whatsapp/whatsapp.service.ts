import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  WebhookPayload,
  WebhookMessage,
} from './interfaces/webhook-payload.interface';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl: string;
  private readonly accessToken: string;
  private readonly dryRun: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectQueue('whatsapp-inbound')
    private readonly whatsappQueue: Queue,
  ) {
    const version = this.configService.get<string>(
      'WHATSAPP_API_VERSION',
      'v21.0',
    );
    const phoneId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    this.apiUrl = `https://graph.facebook.com/${version}/${phoneId}/messages`;
    this.accessToken =
      this.configService.get<string>('WHATSAPP_ACCESS_TOKEN') ?? '';

    // Enable dry-run mode if WHATSAPP_DRY_RUN=true or if token looks like a placeholder
    const token = this.configService.get<string>('WHATSAPP_ACCESS_TOKEN') ?? '';
    this.dryRun =
      this.configService.get<string>('WHATSAPP_DRY_RUN') === 'true' ||
      token === '' ||
      token.startsWith('EAAAFunny') ||
      token.includes('YOUR_');
  }

  // ═══════════════════════════════════════════
  // Webhook Verification
  // ═══════════════════════════════════════════
  verifyWebhook(
    mode: string,
    token: string,
    challenge: string,
  ): string | { error: string } {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verified successfully');
      return challenge;
    }
    this.logger.warn('Webhook verification failed');
    return { error: 'Verification failed' };
  }

  // ═══════════════════════════════════════════
  // Enqueue inbound messages for async processing
  // ═══════════════════════════════════════════
  async enqueueInboundMessage(payload: WebhookPayload): Promise<void> {
    // Extract first message from payload
    const message = this.extractFirstMessage(payload);
    if (!message) {
      this.logger.debug('No message found in webhook payload');
      return;
    }

    await this.whatsappQueue.add('process-message', {
      phone: message.from,
      message,
      raw: payload,
      waMessageTimestamp: message.timestamp,
    });

    this.logger.debug(`Enqueued message ${message.id} from ${message.from}`);
  }

  // ═══════════════════════════════════════════
  // Send Messages
  // ═══════════════════════════════════════════
  async sendText(to: string, body: string): Promise<string> {
    // Dry-run mode: log and return fake ID without calling WhatsApp API
    if (this.dryRun) {
      this.logger.log(`[DRY-RUN] Would send text to ${to}: ${body.substring(0, 50)}...`);
      return `dryrun_${Date.now()}`;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body },
    };

    const response = await this.httpService
      .post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();

    const messageId = response?.data?.messages?.[0]?.id;
    this.logger.log(`Sent text message to ${to}, ID: ${messageId}`);
    return messageId;
  }

  async sendImage(
    to: string,
    imageUrl: string,
    caption: string,
  ): Promise<string> {
    // Dry-run mode: log and return fake ID without calling WhatsApp API
    if (this.dryRun) {
      this.logger.log(
        `[DRY-RUN] Would send image to ${to}: ${imageUrl.substring(0, 50)}...`,
      );
      this.logger.log(`[DRY-RUN] Caption: ${caption.substring(0, 50)}...`);
      return `dryrun_${Date.now()}`;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'image',
      image: {
        link: imageUrl,
        caption,
      },
    };

    const response = await this.httpService
      .post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();

    const messageId = response?.data?.messages?.[0]?.id;
    this.logger.log(`Sent image to ${to}, ID: ${messageId}`);
    return messageId;
  }

  // ═══════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════
  private extractFirstMessage(payload: WebhookPayload): WebhookMessage | null {
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.value.messages?.length) {
          return change.value.messages[0];
        }
      }
    }
    return null;
  }
}
