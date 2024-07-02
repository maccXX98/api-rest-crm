import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [...categoryProviders, CategoriesService],
  exports: [...categoryProviders],
})
export class CategoriesModule {}
