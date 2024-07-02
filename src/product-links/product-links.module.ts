import { Module } from '@nestjs/common';
import { ProductLinksService } from './product-links.service';
import { ProductLinksController } from './product-links.controller';
import { productLinkProviders } from './product-links.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProductLinksController],
  providers: [...productLinkProviders, ProductLinksService],
  exports: [...productLinkProviders],
})
export class ProductLinksModule {}
