import { Module } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersController } from './product-orders.controller';
import { productOrderProviders } from './product-orders.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { DistributorsModule } from '../distributors/distributors.module';

@Module({
  imports: [DatabaseModule, UsersModule, DistributorsModule],
  controllers: [ProductOrdersController],
  providers: [...productOrderProviders, ProductOrdersService],
  exports: [...productOrderProviders],
})
export class ProductOrdersModule {}
