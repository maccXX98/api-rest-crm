import { Inject, Injectable } from '@nestjs/common';
import { CreateProductOrderDetailDto } from './dto/create-product-order-detail.dto';
import { UpdateProductOrderDetailDto } from './dto/update-product-order-detail.dto';
import {
  PRODUCT_ORDER_DETAIL_REPOSITORY,
  PRODUCT_ORDER_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '../constants';
import { Repository } from 'typeorm';
import { ProductOrderDetail } from './entities/product-order-detail.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductOrderDetailsService {
  constructor(
    @Inject(PRODUCT_ORDER_DETAIL_REPOSITORY)
    private productOrderDetailRepository: Repository<ProductOrderDetail>,
    @Inject(PRODUCT_ORDER_REPOSITORY)
    private productOrderRepository: Repository<ProductOrder>,
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductOrderDetailDto: CreateProductOrderDetailDto,
  ): Promise<ProductOrderDetail> {
    const newProductOrderDetail = this.productOrderDetailRepository.create(
      createProductOrderDetailDto,
    );

    const productOrder = await this.productOrderRepository.findOne({
      where: { ProductOrderID: createProductOrderDetailDto.ProductOrderID },
    });
    if (!productOrder) {
      throw new Error(
        `ProductOrder with ID ${createProductOrderDetailDto.ProductOrderID} not found`,
      );
    }
    newProductOrderDetail.productOrder = productOrder;

    const product = await this.productRepository.findOne({
      where: { ProductID: createProductOrderDetailDto.ProductID },
    });
    if (!product) {
      throw new Error(
        `Product with ID ${createProductOrderDetailDto.ProductID} not found`,
      );
    }
    newProductOrderDetail.product = product;

    return this.productOrderDetailRepository.save(newProductOrderDetail);
  }

  async findAll(): Promise<ProductOrderDetail[]> {
    return this.productOrderDetailRepository.find({
      relations: ['productOrder', 'product'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<ProductOrderDetail> {
    return this.productOrderDetailRepository.findOne({
      where: { ProductOrderDetailID: id },
      relations: ['productOrder', 'product'],
    });
  }

  async update(
    id: number,
    updateProductOrderDetailDto: UpdateProductOrderDetailDto,
  ): Promise<ProductOrderDetail> {
    const productOrderDetail = await this.productOrderDetailRepository.findOne({
      where: { ProductOrderDetailID: id },
    });
    if (!productOrderDetail) {
      throw new Error(`ProductOrderDetail with ID ${id} not found`);
    }

    if (updateProductOrderDetailDto.ProductOrderID) {
      const productOrder = await this.productOrderRepository.findOne({
        where: { ProductOrderID: updateProductOrderDetailDto.ProductOrderID },
      });
      if (!productOrder) {
        throw new Error(
          `ProductOrder with ID ${updateProductOrderDetailDto.ProductOrderID} not found`,
        );
      }
      productOrderDetail.productOrder = productOrder;
      delete updateProductOrderDetailDto.ProductOrderID;
    }

    if (updateProductOrderDetailDto.ProductID) {
      const product = await this.productRepository.findOne({
        where: { ProductID: updateProductOrderDetailDto.ProductID },
      });
      if (!product) {
        throw new Error(
          `Product with ID ${updateProductOrderDetailDto.ProductID} not found`,
        );
      }
      productOrderDetail.product = product;
      delete updateProductOrderDetailDto.ProductID;
    }

    await this.productOrderDetailRepository.update(
      { ProductOrderDetailID: id },
      updateProductOrderDetailDto,
    );
    return this.productOrderDetailRepository.findOne({
      where: { ProductOrderDetailID: id },
      relations: ['productOrder', 'product'],
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productOrderDetailRepository.softDelete({
      ProductOrderDetailID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`ProductOrderDetail with ID ${id} not found`);
    }
  }
}
