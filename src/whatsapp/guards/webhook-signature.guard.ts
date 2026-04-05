import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const rawBody: Buffer = (request as any).rawBody;
    const signature = request.headers['x-hub-signature-256'] as string;

    if (!rawBody || !signature) {
      throw new UnauthorizedException('Missing signature or raw body');
    }

    const appSecret = this.configService.get<string>('WHATSAPP_APP_SECRET');
    if (!appSecret) {
      throw new UnauthorizedException('WhatsApp app secret not configured');
    }

    const expectedSignature = this.computeHmacSha256(rawBody, appSecret);

    if (!this.timingSafeEqual(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }

  private computeHmacSha256(body: Buffer, secret: string): string {
    return (
      'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex')
    );
  }

  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
      return false;
    }
  }
}
