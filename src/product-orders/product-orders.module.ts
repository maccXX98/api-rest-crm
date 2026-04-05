import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersController } from './product-orders.controller';
import { ProductOrder } from './entities/product-order.entity';
import { UsersModule } from '../users/users.module';
import { DistributorsModule } from '../distributors/distributors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrder]),
    UsersModule,
    DistributorsModule,
  ],
  controllers: [ProductOrdersController],
  providers: [ProductOrdersService],
  exports: [TypeOrmModule.forFeature([ProductOrder]), ProductOrdersService],
})
export class ProductOrdersModule {}
