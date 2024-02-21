import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from '../database/database.module';
import { productProviders } from './product.providers';
import { DistributorsModule } from '../distributors/distributors.module';

@Module({
  imports: [DatabaseModule, DistributorsModule],
  controllers: [ProductsController],
  providers: [...productProviders, ProductsService],
  exports: [...productProviders],
})
export class ProductsModule {}
