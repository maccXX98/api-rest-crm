import { Module } from '@nestjs/common';
import { CustomerOrdersService } from './customer-orders.service';
import { CustomerOrdersController } from './customer-orders.controller';
import { customerOrdersProviders } from './customer-orders.providers';
import { CustomersModule } from '../customers/customers.module';
import { CitiesModule } from '../cities/cities.module';
import { PaymentMetodsModule } from '../payment-metods/payment-metods.module';

@Module({
  imports: [CustomersModule, CitiesModule, PaymentMetodsModule],
  controllers: [CustomerOrdersController],
  providers: [...customerOrdersProviders, CustomerOrdersService],
  exports: [...customerOrdersProviders],
})
export class CustomerOrdersModule {}
