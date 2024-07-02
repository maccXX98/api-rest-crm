import { Module } from '@nestjs/common';
import { ProductOrderDetailsService } from './product-order-details.service';
import { ProductOrderDetailsController } from './product-order-details.controller';
import { productOrderDetailProviders } from './product-order-details.providers';
import { ProductsModule } from '../products/products.module';
import { ProductOrdersModule } from '../product-orders/product-orders.module';

@Module({
  imports: [ProductsModule, ProductOrdersModule],
  controllers: [ProductOrderDetailsController],
  providers: [...productOrderDetailProviders, ProductOrderDetailsService],
  exports: [...productOrderDetailProviders],
})
export class ProductOrderDetailsModule {}
