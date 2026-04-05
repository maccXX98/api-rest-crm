import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant]), ProductsModule],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
  exports: [TypeOrmModule.forFeature([ProductVariant]), ProductVariantsService],
})
export class ProductVariantsModule {}
