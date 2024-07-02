import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productProviders } from './product.providers';
import { DistributorsModule } from '../distributors/distributors.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [DistributorsModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [...productProviders, ProductsService],
  exports: [...productProviders],
})
export class ProductsModule {}
