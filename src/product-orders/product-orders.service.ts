import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';
import { ProductOrder } from './entities/product-order.entity';
import { Distributor } from '../distributors/entities/distributor.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductOrdersService {
  constructor(
    @InjectRepository(ProductOrder)
    private productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(Distributor)
    private distributorRepository: Repository<Distributor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createProductOrderDto: CreateProductOrderDto,
  ): Promise<ProductOrder> {
    const newProductOrder = this.productOrderRepository.create(
      createProductOrderDto,
    );

    const distributor = await this.distributorRepository.findOne({
      where: { DistributorID: createProductOrderDto.DistributorID },
    });
    if (!distributor) {
      throw new Error(
        `Distributor with ID ${createProductOrderDto.DistributorID} not found`,
      );
    }
    newProductOrder.DistributorID = distributor.DistributorID;

    const user = await this.userRepository.findOne({
      where: { UserID: createProductOrderDto.UserID },
    });
    if (!user) {
      throw new Error(`User with ID ${createProductOrderDto.UserID} not found`);
    }
    newProductOrder.UserID = user.UserID;

    return this.productOrderRepository.save(newProductOrder);
  }

  async findAll(): Promise<ProductOrder[]> {
    return this.productOrderRepository.find({
      relations: ['distributor', 'user'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<ProductOrder> {
    const order = await this.productOrderRepository.findOne({
      where: { ProductOrderID: id },
      relations: ['distributor', 'user'],
    });
    if (!order) throw new Error(`ProductOrder with ID ${id} not found`);
    return order;
  }

  async update(
    id: number,
    updateProductOrderDto: UpdateProductOrderDto,
  ): Promise<ProductOrder> {
    const productOrder = await this.productOrderRepository.findOne({
      where: { ProductOrderID: id },
    });
    if (!productOrder) {
      throw new Error(`ProductOrder with ID ${id} not found`);
    }

    if (updateProductOrderDto.DistributorID) {
      const distributor = await this.distributorRepository.findOne({
        where: { DistributorID: updateProductOrderDto.DistributorID },
      });
      if (!distributor) {
        throw new Error(
          `Distributor with ID ${updateProductOrderDto.DistributorID} not found`,
        );
      }
      productOrder.DistributorID = distributor.DistributorID;
      delete updateProductOrderDto.DistributorID;
    }

    if (updateProductOrderDto.UserID) {
      const user = await this.userRepository.findOne({
        where: { UserID: updateProductOrderDto.UserID },
      });
      if (!user) {
        throw new Error(
          `User with ID ${updateProductOrderDto.UserID} not found`,
        );
      }
      productOrder.UserID = user.UserID;
      delete updateProductOrderDto.UserID;
    }

    await this.productOrderRepository.update(
      { ProductOrderID: id },
      updateProductOrderDto,
    );
    const updatedOrder = await this.productOrderRepository.findOne({
      where: { ProductOrderID: id },
      relations: ['distributor', 'user'],
    });
    if (!updatedOrder) throw new Error(`ProductOrder with ID ${id} not found`);
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productOrderRepository.softDelete({
      ProductOrderID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`ProductOrder with ID ${id} not found`);
    }
  }
}
