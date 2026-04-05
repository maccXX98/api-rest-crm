import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerOrderDetailDto } from './dto/create-customer-order-detail.dto';
import { UpdateCustomerOrderDetailDto } from './dto/update-customer-order-detail.dto';
import { CustomerOrderDetail } from './entities/customer-order-detail.entity';
import { CustomerOrder } from '../customer-orders/entities/customer-order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CustomerOrderDetailsService {
  constructor(
    @InjectRepository(CustomerOrderDetail)
    private customerOrderDetailRepository: Repository<CustomerOrderDetail>,
    @InjectRepository(CustomerOrder)
    private customerOrderRepository: Repository<CustomerOrder>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createCustomerOrderDetailDto: CreateCustomerOrderDetailDto,
  ): Promise<CustomerOrderDetail> {
    const { CustomerOrderID, ProductID, Quantity } =
      createCustomerOrderDetailDto;

    const customerOrder = await this.customerOrderRepository.findOne({
      where: { CustomerOrderID },
    });
    if (!customerOrder) {
      throw new Error('CustomerOrder not found');
    }

    const product = await this.productRepository.findOne({
      where: { ProductID },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const customerOrderDetail = this.customerOrderDetailRepository.create({
      customerOrder,
      product,
      Quantity,
    });

    return this.customerOrderDetailRepository.save(customerOrderDetail);
  }

  async findAll(): Promise<CustomerOrderDetail[]> {
    return this.customerOrderDetailRepository.find({
      relations: ['customerOrder', 'product'],
    });
  }

  async findOne(id: number): Promise<CustomerOrderDetail> {
    const customerOrderDetail =
      await this.customerOrderDetailRepository.findOne({
        where: { CustomerOrderDetailID: id },
        relations: ['customerOrder', 'product'],
      });

    if (!customerOrderDetail) {
      throw new Error(`CustomerOrderDetail #${id} not found`);
    }

    return customerOrderDetail;
  }

  async update(
    id: number,
    updateCustomerOrderDetailDto: UpdateCustomerOrderDetailDto,
  ): Promise<CustomerOrderDetail> {
    const customerOrderDetail =
      await this.customerOrderDetailRepository.preload({
        CustomerOrderDetailID: id,
        ...updateCustomerOrderDetailDto,
      });

    if (!customerOrderDetail) {
      throw new Error(`CustomerOrderDetail #${id} not found`);
    }

    return this.customerOrderDetailRepository.save(customerOrderDetail);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerOrderDetailRepository.softDelete(id);
    if (result.affected === 0) {
      throw new Error(`CustomerOrderDetail with ID ${id} not found`);
    }
  }
}
