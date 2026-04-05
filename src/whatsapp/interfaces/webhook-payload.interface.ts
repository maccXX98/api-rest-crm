export interface WebhookPayload {
  object: 'whatsapp_business_account';
  entry: WebhookEntry[];
}

export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WebhookChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts?: WebhookContact[];
    messages?: WebhookMessage[];
    statuses?: WebhookStatus[];
  };
  field: string;
}

export interface WebhookContact {
  profile: { name: string };
  wa_id: string;
}

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type:
    | 'text'
    | 'image'
    | 'interactive'
    | 'button'
    | 'document'
    | 'sticker'
    | 'reaction';
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; url?: string };
  interactive?: {
    type: string;
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
  reaction?: { emoji: string; message_id: string };
}

export interface WebhookStatus {
  id: string;
  recipient_id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  conversation?: { id: string; origin: { type: string } };
  pricing?: { billable: boolean; pricing_model: string };
}
