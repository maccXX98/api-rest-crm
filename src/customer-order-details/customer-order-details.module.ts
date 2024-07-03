import { Module } from '@nestjs/common';
import { CustomerOrderDetailsService } from './customer-order-details.service';
import { CustomerOrderDetailsController } from './customer-order-details.controller';
import { customerOrderDetailsProviders } from './customer-order-details.providers';
import { ProductsModule } from '../products/products.module';
import { CustomerOrdersModule } from '../customer-orders/customer-orders.module';

@Module({
  imports: [ProductsModule, CustomerOrdersModule],
  controllers: [CustomerOrderDetailsController],
  providers: [...customerOrderDetailsProviders, CustomerOrderDetailsService],
  exports: [...customerOrderDetailsProviders],
})
export class CustomerOrderDetailsModule {}
