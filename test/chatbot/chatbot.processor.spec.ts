import { Test } from '@nestjs/testing';
import { Job } from 'bullmq';
import { ChatbotProcessor, InboundMessageJob } from '../../src/chatbot/chatbot.processor';
import { ChatbotService } from '../../src/chatbot/chatbot.service';
import { MessageLogService } from '../../src/message-log/message-log.service';
import { WebhookMessage } from '../../src/whatsapp/interfaces/webhook-payload.interface';
import { Conversation } from '../../src/chatbot/entities/conversation.entity';
import { ConversationStep } from '../../src/chatbot/entities/conversation-step.enum';

describe('ChatbotProcessor', () => {
  let processor: ChatbotProcessor;

  const mockChatbotService = {
    getOrCreateConversation: jest.fn(),
    processMessage: jest.fn(),
  };
  const mockMessageLogService = {
    existsByWaMessageId: jest.fn(),
    logInbound: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ChatbotProcessor,
        { provide: ChatbotService, useValue: mockChatbotService },
        { provide: MessageLogService, useValue: mockMessageLogService },
      ],
    }).compile();
    processor = module.get<ChatbotProcessor>(ChatbotProcessor);
  });

  describe('process', () => {
    it('should skip already processed messages (idempotency)', async () => {
      const job = createJob('59171234567', 'msg123');
      mockMessageLogService.existsByWaMessageId.mockResolvedValue(true);

      await processor.process(job);

      expect(mockMessageLogService.logInbound).not.toHaveBeenCalled();
      expect(mockChatbotService.processMessage).not.toHaveBeenCalled();
    });

    it('should log and process new messages', async () => {
      const job = createJob('59171234567', 'msg456');
      const conversation = createConversation('59171234567', ConversationStep.IDLE);

      mockMessageLogService.existsByWaMessageId.mockResolvedValue(false);
      mockMessageLogService.logInbound.mockResolvedValue({});
      mockChatbotService.getOrCreateConversation.mockResolvedValue(conversation);
      mockChatbotService.processMessage.mockResolvedValue(undefined);

      await processor.process(job);

      expect(mockMessageLogService.logInbound).toHaveBeenCalled();
      expect(mockChatbotService.getOrCreateConversation).toHaveBeenCalledWith('59171234567');
      expect(mockChatbotService.processMessage).toHaveBeenCalledWith('59171234567', job.data.message, conversation);
    });

    it('should skip stale messages', async () => {
      const job = createJobWithTimestamp('59171234567', 'msg_old', '9999999990'); // older timestamp
      const conversation = createConversation('59171234567', ConversationStep.AWAITING_CITY, '9999999999'); // newer timestamp

      mockMessageLogService.existsByWaMessageId.mockResolvedValue(false);
      mockMessageLogService.logInbound.mockResolvedValue({});
      mockChatbotService.getOrCreateConversation.mockResolvedValue(conversation);

      await processor.process(job);

      expect(mockChatbotService.processMessage).not.toHaveBeenCalled();
    });
  });

  // isStaleMessage tests
  describe('isStaleMessage', () => {
    it('should detect stale messages', () => {
      const oldMessage = createMessage('msg_old', '9999999990'); // older timestamp
      const conversation = createConversation('59171234567', ConversationStep.AWAITING_CITY, '9999999999'); // newer

      const result = (processor as any).isStaleMessage(oldMessage, conversation);

      expect(result).toBe(true);
    });

    it('should not flag newer messages as stale', () => {
      const newMessage = createMessage('msg_new', '9999999999'); // newer timestamp
      const conversation = createConversation('59171234567', ConversationStep.AWAITING_CITY, '9999999990'); // older

      const result = (processor as any).isStaleMessage(newMessage, conversation);

      expect(result).toBe(false);
    });

    it('should not flag as stale when conversation has no timestamp', () => {
      const message = createMessage('msg_new', '9999999999');
      const conversation = createConversation('59171234567', ConversationStep.IDLE, undefined);

      const result = (processor as any).isStaleMessage(message, conversation);

      expect(result).toBe(false);
    });
  });
});

function createJob(phone: string, msgId: string): Job<InboundMessageJob> {
  return {
    id: 1,
    data: {
      phone,
      message: createMessage(msgId, Date.now().toString()),
      raw: {},
      waMessageTimestamp: Date.now().toString(),
    },
  } as any;
}

function createJobWithTimestamp(phone: string, msgId: string, timestamp: string): Job<InboundMessageJob> {
  return {
    id: 1,
    data: {
      phone,
      message: createMessage(msgId, timestamp),
      raw: {},
      waMessageTimestamp: timestamp,
    },
  } as any;
}

function createMessage(id: string, timestamp: string): WebhookMessage {
  return {
    from: '59171234567',
    id,
    timestamp,
    type: 'text',
    text: { body: 'test' },
  };
}

function createConversation(
  phone: string,
  step: ConversationStep,
  lastTimestamp?: string,
): Conversation {
  return {
    id: 1,
    phone,
    currentStep: step,
    lastProductId: null,
    lastWaMessageId: null,
    lastWaMessageTimestamp: lastTimestamp || null,
    metadata: {},
    expiresAt: new Date(Date.now() + 3600000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
