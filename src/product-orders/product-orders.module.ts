import { Module } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersController } from './product-orders.controller';
import { productOrderProviders } from './product-orders.providers';
import { UsersModule } from '../users/users.module';
import { DistributorsModule } from '../distributors/distributors.module';

@Module({
  imports: [UsersModule, DistributorsModule],
  controllers: [ProductOrdersController],
  providers: [...productOrderProviders, ProductOrdersService],
  exports: [...productOrderProviders],
})
export class ProductOrdersModule {}
