import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrdersService } from './customer-orders.service';
import { CustomerOrdersController } from './customer-orders.controller';
import { CustomerOrder } from './entities/customer-order.entity';
import { CustomersModule } from '../customers/customers.module';
import { CitiesModule } from '../cities/cities.module';
import { PaymentMetodsModule } from '../payment-metods/payment-metods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerOrder]),
    CustomersModule,
    CitiesModule,
    PaymentMetodsModule,
  ],
  controllers: [CustomerOrdersController],
  providers: [CustomerOrdersService],
  exports: [TypeOrmModule.forFeature([CustomerOrder]), CustomerOrdersService],
})
export class CustomerOrdersModule {}
