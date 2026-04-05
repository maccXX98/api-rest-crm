import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrderDetailsService } from './customer-order-details.service';
import { CustomerOrderDetailsController } from './customer-order-details.controller';
import { CustomerOrderDetail } from './entities/customer-order-detail.entity';
import { ProductsModule } from '../products/products.module';
import { CustomerOrdersModule } from '../customer-orders/customer-orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerOrderDetail]),
    ProductsModule,
    CustomerOrdersModule,
  ],
  controllers: [CustomerOrderDetailsController],
  providers: [CustomerOrderDetailsService],
  exports: [
    TypeOrmModule.forFeature([CustomerOrderDetail]),
    CustomerOrderDetailsService,
  ],
})
export class CustomerOrderDetailsModule {}
