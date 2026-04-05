import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WebhookSignatureGuard } from './guards/webhook-signature.guard';
import { Public } from '../auth/public.decorator';
import { WebhookPayload } from './interfaces/webhook-payload.interface';
import { FastifyRequest } from 'fastify';

@Controller('whatsapp')
@Public()
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string | { error: string } {
    return this.whatsappService.verifyWebhook(mode, token, challenge);
  }

  @Post('webhook')
  @UseGuards(WebhookSignatureGuard)
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() body: WebhookPayload,
    @Req() _req: FastifyRequest,
  ): Promise<{ status: string }> {
    // IMPORTANT: Respond immediately (< 5 seconds), process async
    await this.whatsappService.enqueueInboundMessage(body);
    return { status: 'enqueued' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SIMULATION ENDPOINT — FOR LOCAL TESTING ONLY
  // Skips HMAC signature verification
  // ═══════════════════════════════════════════════════════════════════════
  @Post('simulate/inbound')
  @HttpCode(HttpStatus.OK)
  async simulateInbound(
    @Body() body: WebhookPayload,
  ): Promise<{ status: string; jobId?: string }> {
    await this.whatsappService.enqueueInboundMessage(body);
    return { status: 'simulated_enqueued' };
  }
}
