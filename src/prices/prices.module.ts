import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { priceProviders } from './price.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [PricesController],
  providers: [...priceProviders, PricesService],
  exports: [...priceProviders],
})
export class PricesModule {}
