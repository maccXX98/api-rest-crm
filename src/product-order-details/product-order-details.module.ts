import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrderDetailsService } from './product-order-details.service';
import { ProductOrderDetailsController } from './product-order-details.controller';
import { ProductOrderDetail } from './entities/product-order-detail.entity';
import { ProductsModule } from '../products/products.module';
import { ProductOrdersModule } from '../product-orders/product-orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrderDetail]),
    ProductsModule,
    ProductOrdersModule,
  ],
  controllers: [ProductOrderDetailsController],
  providers: [ProductOrderDetailsService],
  exports: [
    TypeOrmModule.forFeature([ProductOrderDetail]),
    ProductOrderDetailsService,
  ],
})
export class ProductOrderDetailsModule {}
