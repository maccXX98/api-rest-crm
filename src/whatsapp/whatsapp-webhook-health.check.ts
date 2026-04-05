import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WhatsAppWebhookHealthCheck implements OnApplicationBootstrap {
  private readonly logger = new Logger(WhatsAppWebhookHealthCheck.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Verify WABA subscription at startup to catch silent failures
    const wabaId = this.configService.get<string>('WHATSAPP_WABA_ID');
    const accessToken = this.configService.get<string>('WHATSAPP_ACCESS_TOKEN');

    if (!wabaId || !accessToken) {
      this.logger.warn(
        'WHATSAPP_WABA_ID or WHATSAPP_ACCESS_TOKEN not configured. ' +
          'Webhook subscription check skipped.',
      );
      return;
    }

    try {
      const response = await this.httpService
        .get(`https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`, {
          params: { access_token: accessToken },
        })
        .toPromise();

      if (response?.data?.data?.length > 0) {
        this.logger.log('WhatsApp webhook subscription verified OK');
      } else {
        this.logger.warn(
          'No webhook subscription found. ' +
            'Please subscribe to webhooks in Meta App Dashboard.',
        );
      }
    } catch (error) {
      this.logger.error(
        'Failed to verify WhatsApp webhook subscription. ' +
          'Check WHATSAPP_ACCESS_TOKEN and WHATSAPP_WABA_ID.',
        error?.response?.data ?? error,
      );
    }
  }
}
