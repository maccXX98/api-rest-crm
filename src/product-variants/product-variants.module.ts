import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { productVariantProviders } from './product-variants.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProductVariantsController],
  providers: [...productVariantProviders, ProductVariantsService],
  exports: [...productVariantProviders],
})
export class ProductVariantsModule {}
