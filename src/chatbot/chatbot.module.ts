import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotProcessor } from './chatbot.processor';
import { Conversation } from './entities/conversation.entity';
import { ProductsModule } from '../products/products.module';
import { ProductLinksModule } from '../product-links/product-links.module';
import { CitiesModule } from '../cities/cities.module';
import { PaymentMetodsModule } from '../payment-metods/payment-metods.module';
import { CustomersModule } from '../customers/customers.module';
import { CustomerOrdersModule } from '../customer-orders/customer-orders.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { MessageLogModule } from '../message-log/message-log.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'whatsapp-inbound',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
      },
    }),
    TypeOrmModule.forFeature([Conversation]),
    ProductsModule,
    ProductLinksModule,
    CitiesModule,
    PaymentMetodsModule,
    CustomersModule,
    CustomerOrdersModule,
    WhatsAppModule,
    MessageLogModule,
  ],
  providers: [ChatbotService, ChatbotProcessor],
  exports: [ChatbotService],
})
export class ChatbotModule {}
