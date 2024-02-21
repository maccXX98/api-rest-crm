import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_REPOSITORY, DISTRIBUTOR_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Distributor } from '../distributors/entities/distributor.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
    @Inject(DISTRIBUTOR_REPOSITORY)
    private distributorRepository: Repository<Distributor>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    const distributor = await this.distributorRepository.findOne({
      where: { DistributorID: createProductDto.DistributorID },
    });
    if (!distributor) {
      throw new Error(
        `Distributor with ID ${createProductDto.DistributorID} not found`,
      );
    }
    newProduct.distributor = Promise.resolve(distributor);

    return this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['distributor'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['distributor'],
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { ProductID: id },
    });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    if (updateProductDto.DistributorID) {
      const distributor = await this.distributorRepository.findOne({
        where: { DistributorID: updateProductDto.DistributorID },
      });
      if (!distributor) {
        throw new Error(
          `Distributor with ID ${updateProductDto.DistributorID} not found`,
        );
      }
      product.distributor = Promise.resolve(distributor);
      delete updateProductDto.DistributorID;
    }

    await this.productRepository.update({ ProductID: id }, updateProductDto);
    return this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['distributor'],
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productRepository.softDelete({
      ProductID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`Product with ID ${id} not found`);
    }
  }
}
