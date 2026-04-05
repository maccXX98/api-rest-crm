import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributorRelation } from './entities/distributor-relation.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';
import { ProductOrderDetail } from '../product-order-details/entities/product-order-detail.entity';

@Injectable()
export class DistributorRelationsService {
  constructor(
    @InjectRepository(ProductOrder)
    private productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(ProductOrderDetail)
    private productOrderDetailRepository: Repository<ProductOrderDetail>,
    @InjectRepository(DistributorRelation)
    private distributorRelationRepository: Repository<DistributorRelation>,
  ) {}

  async findAll(): Promise<DistributorRelation[]> {
    return await this.distributorRelationRepository.find({
      relations: ['distributor'],
    });
  }

  async findOne(id: number): Promise<DistributorRelation> {
    const relation = await this.distributorRelationRepository.findOne({
      where: { DistributorID: id },
      relations: ['distributor'],
    });
    if (!relation)
      throw new Error(`DistributorRelation with ID ${id} not found`);
    return relation;
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
