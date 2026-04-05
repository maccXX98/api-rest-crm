import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStep } from './entities/conversation.entity';
import { WebhookMessage } from '../whatsapp/interfaces/webhook-payload.interface';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { ProductLinksService } from '../product-links/product-links.service';
import { ProductsService } from '../products/products.service';
import { CitiesService } from '../cities/cities.service';
import { PaymentMetodsService } from '../payment-metods/payment-metods.service';
import { CustomersService } from '../customers/customers.service';
import { CustomerOrdersService } from '../customer-orders/customer-orders.service';
import { normalizeAndSplit } from './helpers/text-normalizer';
import { extractText } from './helpers/extract-text';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly conversationTTL: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    private readonly productLinksService: ProductLinksService,
    private readonly productsService: ProductsService,
    private readonly citiesService: CitiesService,
    private readonly paymentMethodsService: PaymentMetodsService,
    private readonly customersService: CustomersService,
    private readonly customerOrdersService: CustomerOrdersService,
    private readonly whatsappService: WhatsAppService,
  ) {
    this.conversationTTL =
      (this.configService.get<number>('CONVERSATION_TTL_MINUTES', 60) || 60) *
      60 *
      1000;
  }

  // ═══════════════════════════════════════════
  // Main entry point
  // ═══════════════════════════════════════════
  async processMessage(
    phone: string,
    message: WebhookMessage,
    conversation: Conversation,
  ): Promise<void> {
    // Check TTL
    if (Date.now() > conversation.expiresAt.getTime()) {
      await this.resetToIdle(conversation);
    }

    // Route by step
    switch (conversation.currentStep) {
      case ConversationStep.IDLE:
        return this.handleIdle(phone, message, conversation);
      case ConversationStep.AWAITING_CITY:
        return this.handleCityResponse(phone, message, conversation);
      case ConversationStep.AWAITING_PAYMENT:
        return this.handlePaymentResponse(phone, message, conversation);
      case ConversationStep.COMPLETED:
      case ConversationStep.EXPIRED:
        await this.resetToIdle(conversation);
        return this.handleIdle(phone, message, conversation);
    }
  }

  // ═══════════════════════════════════════════
  // IDLE → Check if message contains product URL
  // ═══════════════════════════════════════════
  async handleIdle(
    phone: string,
    message: WebhookMessage,
    conversation: Conversation,
  ): Promise<void> {
    const text = extractText(message);
    if (!text) return;

    const url = this.extractUrl(text);
    if (!url) {
      this.logger.debug(`[handleIdle] No URL found in text: "${text}"`);
      return;
    }

    this.logger.log(`[handleIdle] Looking for product with URL: ${url}`);

    const result = await this.productLinksService.findByUrl(url);
    if (!result) {
      this.logger.debug(`[handleIdle] Product not found for URL: ${url}`);
      return;
    }

    const { product: fullProduct } = result;

    this.logger.log(`[handleIdle] Found product: ${fullProduct?.Name}, Image: ${fullProduct?.Image?.substring(0, 30)}...`);

    if (!fullProduct?.Image) {
      this.logger.error(`[handleIdle] Product ${fullProduct?.ProductID} has no Image!`);
      return;
    }

    // Send product info
    await this.whatsappService.sendImage(
      phone,
      fullProduct.Image,
      fullProduct.Template,
    );

    // Wait 1s then send city question
    await this.delay(1000);
    await this.whatsappService.sendText(phone, '¿De qué ciudad eres?');

    // Update conversation
    await this.conversationRepo.update(conversation.id, {
      currentStep: ConversationStep.AWAITING_CITY,
      lastProductId: fullProduct.ProductID,
      lastWaMessageId: message.id,
      lastWaMessageTimestamp: message.timestamp,
      expiresAt: new Date(Date.now() + this.conversationTTL),
      metadata: { ...conversation.metadata, productId: fullProduct.ProductID },
    });

    this.logger.log(
      `Product ${fullProduct.ProductID} sent to ${phone}, awaiting city`,
    );
  }

  // ═══════════════════════════════════════════
  // AWAITING_CITY → Match city by keywords
  // ═══════════════════════════════════════════
  async handleCityResponse(
    phone: string,
    message: WebhookMessage,
    conversation: Conversation,
  ): Promise<void> {
    const text = extractText(message);
    if (!text) return;

    this.logger.log(`[handleCityResponse] Received city response: "${text}"`);

    const words = normalizeAndSplit(text);
    this.logger.log(`[handleCityResponse] Normalized words: ${JSON.stringify(words)}`);

    const city = await this.citiesService.findByKeywords(words);
    this.logger.log(`[handleCityResponse] Found city: ${city?.city ?? 'NOT FOUND'}`);

    if (!city) {
      await this.whatsappService.sendText(
        phone,
        'Ciudad no reconocida. Intenta de nuevo.',
      );
      return;
    }

    this.logger.log(`[handleCityResponse] City cashOnDelivery: ${city.cashOnDelivery}`);

    await this.whatsappService.sendImage(phone, city.image, city.template);

    if (city.cashOnDelivery) {
      // Contra entrega — complete order immediately
      await this.completeOrder(conversation, phone, city.CityID, null);
    } else {
      // Requires QR payment
      await this.whatsappService.sendText(phone, '¿Método de pago?');
      await this.conversationRepo.update(conversation.id, {
        currentStep: ConversationStep.AWAITING_PAYMENT,
        lastWaMessageId: message.id,
        lastWaMessageTimestamp: message.timestamp,
        metadata: { ...conversation.metadata, cityId: city.CityID },
      });
    }
  }

  // ═══════════════════════════════════════════
  // AWAITING_PAYMENT → Match payment by keywords
  // ═══════════════════════════════════════════
  async handlePaymentResponse(
    phone: string,
    message: WebhookMessage,
    conversation: Conversation,
  ): Promise<void> {
    const text = extractText(message);
    if (!text) return;

    const words = normalizeAndSplit(text);
    const paymentMethod =
      await this.paymentMethodsService.findByKeywords(words);

    if (!paymentMethod) {
      await this.whatsappService.sendText(
        phone,
        'Método de pago no reconocido. Intenta de nuevo.',
      );
      return;
    }

    await this.whatsappService.sendImage(
      phone,
      paymentMethod.image,
      paymentMethod.template,
    );

    await this.completeOrder(
      conversation,
      phone,
      conversation.metadata?.cityId as number,
      paymentMethod.PaymentMethodID,
    );
  }

  // ═══════════════════════════════════════════
  // Complete order helper
  // ═══════════════════════════════════════════
  private async completeOrder(
    conversation: Conversation,
    phone: string,
    cityId: number,
    paymentMethodId: number | null,
  ): Promise<void> {
    // Get or create customer
    const customer = await this.customersService.getOrCreateByPhone(phone);

    // Create order
    await this.customerOrdersService.create({
      CustomerID: customer.CustomerID,
      CityID: cityId,
      PaymentMethodID: paymentMethodId,
    });

    await this.conversationRepo.update(conversation.id, {
      currentStep: ConversationStep.COMPLETED,
      expiresAt: new Date(0), // Already expired
    });

    await this.whatsappService.sendText(
      phone,
      '¡Pedido confirmado! Te contactaremos pronto. 😊',
    );

    this.logger.log(
      `Order completed for ${phone} (city=${cityId}, payment=${paymentMethodId})`,
    );
  }

  // ═══════════════════════════════════════════
  // Conversation management
  // ═══════════════════════════════════════════
  async getOrCreateConversation(phone: string): Promise<Conversation> {
    let conversation = await this.conversationRepo.findOne({
      where: { phone },
      order: { createdAt: 'DESC' },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        phone,
        currentStep: ConversationStep.IDLE,
        expiresAt: new Date(Date.now() + this.conversationTTL),
        metadata: {},
      });
      conversation = await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  private async resetToIdle(conversation: Conversation): Promise<void> {
    await this.conversationRepo.update(conversation.id, {
      currentStep: ConversationStep.IDLE,
      expiresAt: new Date(Date.now() + this.conversationTTL),
    });
  }

  // ═══════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════
  private extractUrl(text: string): string | null {
    const urlPattern = /https?:\/\/[^\s]+/gi;
    const match = text.match(urlPattern);
    return match ? match[0] : null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
  }
}
