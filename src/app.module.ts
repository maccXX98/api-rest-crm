import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { DistributorsModule } from './distributors/distributors.module';
import { DatabaseModule } from './database/database.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { UsersModule } from './users/users.module';
import { ProductOrderDetailsModule } from './product-order-details/product-order-details.module';
import { DistributorRelationsModule } from './distributor-relations/distributor-relations.module';
import { PricesModule } from './prices/prices.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoriesModule } from './inventories/inventories.module';
import { ProductLinksModule } from './product-links/product-links.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { CustomersModule } from './customers/customers.module';
import { PaymentMetodsModule } from './payment-metods/payment-metods.module';
import { CitiesModule } from './cities/cities.module';
import { CustomerOrdersModule } from './customer-orders/customer-orders.module';
import { AuthModule } from './auth/auth.module';
import { CustomerOrderDetailsModule } from './customer-order-details/customer-order-details.module';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { MessageLogModule } from './message-log/message-log.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    ProductsModule,
    DistributorsModule,
    DatabaseModule,
    ProductOrdersModule,
    ProductOrderDetailsModule,
    UsersModule,
    DistributorRelationsModule,
    PricesModule,
    CategoriesModule,
    InventoriesModule,
    ProductLinksModule,
    ProductVariantsModule,
    CustomersModule,
    PaymentMetodsModule,
    CitiesModule,
    CustomerOrdersModule,
    AuthModule,
    CustomerOrderDetailsModule,
    ImageProcessingModule,
    ProductImagesModule,
    WhatsAppModule,
    ChatbotModule,
    MessageLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
