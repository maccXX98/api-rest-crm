import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorRelationsService } from './distributor-relations.service';
import { DistributorRelationsController } from './distributor-relations.controller';
import { DistributorRelation } from './entities/distributor-relation.entity';
import { ProductOrdersModule } from '../product-orders/product-orders.module';
import { ProductOrderDetailsModule } from '../product-order-details/product-order-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistributorRelation]),
    ProductOrdersModule,
    ProductOrderDetailsModule,
  ],
  controllers: [DistributorRelationsController],
  providers: [DistributorRelationsService],
  exports: [
    TypeOrmModule.forFeature([DistributorRelation]),
    DistributorRelationsService,
  ],
})
export class DistributorRelationsModule {}
