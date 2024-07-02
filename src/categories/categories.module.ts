import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { categoryProviders } from './category.providers';

@Module({
  controllers: [CategoriesController],
  providers: [...categoryProviders, CategoriesService],
  exports: [...categoryProviders],
})
export class CategoriesModule {}
