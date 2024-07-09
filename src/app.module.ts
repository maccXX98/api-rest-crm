import { Module } from '@nestjs/common';
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
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [
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
