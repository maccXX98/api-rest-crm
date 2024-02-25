import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DistributorRelation } from './entities/distributor-relation.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';
import { ProductOrderDetail } from '../product-order-details/entities/product-order-detail.entity';
import {
  DISTRIBUTOR_RELATION_REPOSITORY,
  PRODUCT_ORDER_DETAIL_REPOSITORY,
  PRODUCT_ORDER_REPOSITORY,
} from '../constants';

@Injectable()
export class DistributorRelationsService {
  constructor(
    @Inject(PRODUCT_ORDER_REPOSITORY)
    private productOrderRepository: Repository<ProductOrder>,
    @Inject(PRODUCT_ORDER_DETAIL_REPOSITORY)
    private productOrderDetailRepository: Repository<ProductOrderDetail>,
    @Inject(DISTRIBUTOR_RELATION_REPOSITORY)
    private distributorRelationRepository: Repository<DistributorRelation>,
  ) {}

  async findAll(): Promise<DistributorRelation[]> {
    return await this.distributorRelationRepository.find();
  }

  async findOne(id: number): Promise<DistributorRelation> {
    return await this.distributorRelationRepository.findOne({
      where: { DistributorID: id },
    });
  }

  async updateDistributorRelations(distributorId: number) {
    const productOrders = await this.productOrderRepository.find({
      where: { DistributorID: distributorId },
    });
    const totalOrders = productOrders.length;

    let totalSpent = 0;
    for (const order of productOrders) {
      const orderDetails = await this.productOrderDetailRepository.find({
        where: { productOrder: { ProductOrderID: order.ProductOrderID } },
      });

      totalSpent += orderDetails.reduce(
        (sum, detail) => sum + detail.TotalAmount,
        0,
      );
    }

    let distributorRelation = await this.distributorRelationRepository.findOne({
      where: { DistributorID: distributorId },
    });

    if (distributorRelation) {
      distributorRelation.TotalOrders = totalOrders;
      distributorRelation.TotalSpent = totalSpent;
    } else {
      distributorRelation = this.distributorRelationRepository.create({
        DistributorID: distributorId,
        TotalOrders: totalOrders,
        TotalSpent: totalSpent,
      });
    }

    return this.distributorRelationRepository.save(distributorRelation);
  }
}
