import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatbotService } from '../../src/chatbot/chatbot.service';
import { Conversation } from '../../src/chatbot/entities/conversation.entity';
import { ConversationStep } from '../../src/chatbot/entities/conversation-step.enum';
import { WhatsAppService } from '../../src/whatsapp/whatsapp.service';
import { ProductLinksService } from '../../src/product-links/product-links.service';
import { ProductsService } from '../../src/products/products.service';
import { CitiesService } from '../../src/cities/cities.service';
import { PaymentMetodsService } from '../../src/payment-metods/payment-metods.service';
import { CustomersService } from '../../src/customers/customers.service';
import { CustomerOrdersService } from '../../src/customer-orders/customer-orders.service';
import { WebhookMessage } from '../../src/whatsapp/interfaces/webhook-payload.interface';

describe('ChatbotService', () => {
  let service: ChatbotService;

  // Mock services - using plain objects
  const mockWhatsAppService = {
    sendText: jest.fn().mockResolvedValue('msg-id-123'),
    sendImage: jest.fn().mockResolvedValue('msg-id-456'),
  };
  const mockProductLinksService = { findByUrl: jest.fn() };
  const mockProductsService = { findById: jest.fn() };
  const mockCitiesService = { findByKeywords: jest.fn() };
  const mockPaymentMethodsService = { findByKeywords: jest.fn() };
  const mockCustomersService = { getOrCreateByPhone: jest.fn() };
  const mockCustomerOrdersService = { create: jest.fn() };
  const mockConversationRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const mockConfigService = { get: jest.fn().mockReturnValue(60) };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: getRepositoryToken(Conversation), useValue: mockConversationRepo },
        { provide: WhatsAppService, useValue: mockWhatsAppService },
        { provide: ProductLinksService, useValue: mockProductLinksService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: CitiesService, useValue: mockCitiesService },
        { provide: PaymentMetodsService, useValue: mockPaymentMethodsService },
        { provide: CustomersService, useValue: mockCustomersService },
        { provide: CustomerOrdersService, useValue: mockCustomerOrdersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<ChatbotService>(ChatbotService);
  });

  // Tests for IDLE → AWAITING_CITY flow
  describe('handleIdle', () => {
    it('should send product and ask for city when URL matches', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'https://fb.me/abc123');
      const conversation = createConversation(phone, ConversationStep.IDLE);
      const product = { ProductID: 1, Image: 'img.jpg', Template: 'Template' };

      mockProductLinksService.findByUrl.mockResolvedValue({ ProductLinkID: 1, link: 'https://fb.me/abc123' });
      mockProductsService.findById.mockResolvedValue(product);
      mockConversationRepo.update.mockResolvedValue({});

      await service.handleIdle(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).toHaveBeenCalledWith(phone, 'img.jpg', 'Template');
      expect(mockWhatsAppService.sendText).toHaveBeenCalledWith(phone, '¿De qué ciudad eres?');
    });

    it('should ignore message without URL', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'Hola');
      const conversation = createConversation(phone, ConversationStep.IDLE);

      await service.handleIdle(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).not.toHaveBeenCalled();
    });

    it('should ignore when product not found', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'https://unknown.url');
      const conversation = createConversation(phone, ConversationStep.IDLE);

      mockProductLinksService.findByUrl.mockResolvedValue(null);

      await service.handleIdle(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).not.toHaveBeenCalled();
    });
  });

  // Tests for city response with cashOnDelivery
  describe('handleCityResponse', () => {
    it('should complete order immediately for cashOnDelivery cities', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'La Paz');
      const conversation = createConversation(phone, ConversationStep.AWAITING_CITY);
      const city = { CityID: 1, city: 'la paz', cashOnDelivery: true, image: 'img.jpg', template: 'Template' };

      mockCitiesService.findByKeywords.mockResolvedValue(city);
      mockCustomersService.getOrCreateByPhone.mockResolvedValue({ CustomerID: 1 });
      mockCustomerOrdersService.create.mockResolvedValue({});
      mockConversationRepo.update.mockResolvedValue({});

      await service.handleCityResponse(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).toHaveBeenCalledWith(phone, 'img.jpg', 'Template');
      expect(mockCustomerOrdersService.create).toHaveBeenCalledWith({
        CustomerID: 1,
        CityID: 1,
        PaymentMethodID: null,
      });
      expect(mockWhatsAppService.sendText).toHaveBeenCalledWith(phone, '¡Pedido confirmado! Te contactaremos pronto. 😊');
    });

    it('should ask for payment method for non-cashOnDelivery cities', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'Tarija');
      const conversation = createConversation(phone, ConversationStep.AWAITING_CITY);
      const city = { CityID: 3, city: 'tarija', cashOnDelivery: false, image: 'img.jpg', template: 'Template' };

      mockCitiesService.findByKeywords.mockResolvedValue(city);
      mockConversationRepo.update.mockResolvedValue({});

      await service.handleCityResponse(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).toHaveBeenCalled();
      expect(mockWhatsAppService.sendText).toHaveBeenCalledWith(phone, '¿Método de pago?');
    });

    it('should ask to retry for unknown city', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'CiudadInvalida');
      const conversation = createConversation(phone, ConversationStep.AWAITING_CITY);

      mockCitiesService.findByKeywords.mockResolvedValue(null);

      await service.handleCityResponse(phone, message, conversation);

      expect(mockWhatsAppService.sendText).toHaveBeenCalledWith(phone, 'Ciudad no reconocida. Intenta de nuevo.');
    });
  });

  // Tests for payment response
  describe('handlePaymentResponse', () => {
    it('should complete order when payment method found', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'qr');
      const conversation = createConversation(phone, ConversationStep.AWAITING_PAYMENT, { cityId: 3 });
      const paymentMethod = { PaymentMethodID: 2, method: 'pagoqr', image: 'qr.jpg', template: 'Template' };

      mockPaymentMethodsService.findByKeywords.mockResolvedValue(paymentMethod);
      mockCustomersService.getOrCreateByPhone.mockResolvedValue({ CustomerID: 1 });
      mockCustomerOrdersService.create.mockResolvedValue({});
      mockConversationRepo.update.mockResolvedValue({});

      await service.handlePaymentResponse(phone, message, conversation);

      expect(mockWhatsAppService.sendImage).toHaveBeenCalled();
      expect(mockCustomerOrdersService.create).toHaveBeenCalledWith({
        CustomerID: 1,
        CityID: 3,
        PaymentMethodID: 2,
      });
    });

    it('should ask to retry for unknown payment method', async () => {
      const phone = '59171234567';
      const message = createMessage('text', 'MetodoInvalido');
      const conversation = createConversation(phone, ConversationStep.AWAITING_PAYMENT);

      mockPaymentMethodsService.findByKeywords.mockResolvedValue(null);

      await service.handlePaymentResponse(phone, message, conversation);

      expect(mockWhatsAppService.sendText).toHaveBeenCalledWith(phone, 'Método de pago no reconocido. Intenta de nuevo.');
    });
  });

  // Tests for conversation management
  describe('getOrCreateConversation', () => {
    it('should return existing conversation', async () => {
      const phone = '59171234567';
      const existingConv = createConversation(phone, ConversationStep.AWAITING_CITY);
      mockConversationRepo.findOne.mockResolvedValue(existingConv);

      const result = await service.getOrCreateConversation(phone);

      expect(result).toEqual(existingConv);
    });

    it('should create new conversation if none exists', async () => {
      const phone = '59171234567';
      mockConversationRepo.findOne.mockResolvedValue(null);
      mockConversationRepo.create.mockReturnValue(createConversation(phone, ConversationStep.IDLE));
      mockConversationRepo.save.mockResolvedValue(createConversation(phone, ConversationStep.IDLE));

      const result = await service.getOrCreateConversation(phone);

      expect(mockConversationRepo.create).toHaveBeenCalled();
      expect(mockConversationRepo.save).toHaveBeenCalled();
    });
  });
});

// Helper functions
function createMessage(type: string, text: string): WebhookMessage {
  return {
    from: '59171234567',
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now().toString(),
    type: type as any,
    text: { body: text },
  };
}

function createConversation(
  phone: string,
  step: ConversationStep,
  metadata?: Record<string, any>,
): Conversation {
  return {
    id: 1,
    phone,
    currentStep: step,
    lastProductId: null,
    lastWaMessageId: null,
    lastWaMessageTimestamp: null,
    metadata: metadata || {},
    expiresAt: new Date(Date.now() + 3600000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
