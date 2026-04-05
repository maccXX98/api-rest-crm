import { WebhookMessage } from '../../whatsapp/interfaces/webhook-payload.interface';

export function extractText(message: WebhookMessage): string | null {
  switch (message.type) {
    case 'text':
      return message.text?.body ?? null;
    case 'interactive':
      if (message.interactive?.button_reply) {
        return message.interactive.button_reply.title;
      }
      if (message.interactive?.list_reply) {
        return message.interactive.list_reply.title;
      }
      return null;
    default:
      return null;
  }
}
