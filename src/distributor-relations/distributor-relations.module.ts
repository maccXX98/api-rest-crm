import { Module } from '@nestjs/common';
import { DistributorRelationsService } from './distributor-relations.service';
import { DistributorRelationsController } from './distributor-relations.controller';
import { DatabaseModule } from '../database/database.module';
import { distributorRelationProviders } from './distributor-relation.providers';
import { ProductOrdersModule } from '../product-orders/product-orders.module';
import { ProductOrderDetailsModule } from '../product-order-details/product-order-details.module';

@Module({
  imports: [DatabaseModule, ProductOrdersModule, ProductOrderDetailsModule],
  controllers: [DistributorRelationsController],
  providers: [...distributorRelationProviders, DistributorRelationsService],
  exports: [...distributorRelationProviders],
})
export class DistributorRelationsModule {}
