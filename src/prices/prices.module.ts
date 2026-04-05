import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { Price } from './entities/price.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), ProductsModule],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [TypeOrmModule.forFeature([Price]), PricesService],
})
export class PricesModule {}
