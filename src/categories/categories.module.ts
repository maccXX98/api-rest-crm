import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, ProductsModule],
  controllers: [CategoriesController],
  providers: [...categoryProviders, CategoriesService],
  exports: [...categoryProviders],
})
export class CategoriesModule {}
