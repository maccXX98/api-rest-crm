import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  PRODUCT_REPOSITORY,
  DISTRIBUTOR_REPOSITORY,
  CATEGORY_REPOSITORY,
} from '../constants';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Distributor } from '../distributors/entities/distributor.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
    @Inject(DISTRIBUTOR_REPOSITORY)
    private distributorRepository: Repository<Distributor>,
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: Repository<Category>,
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

    const categories = await this.categoryRepository.findBy({
      CategoryID: In(createProductDto.CategoryID),
    });
    if (categories.length !== createProductDto.CategoryID.length) {
      throw new Error('One or more categories not found');
    }

    newProduct.distributor = distributor;
    newProduct.categories = categories;

    return this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['distributor', 'categories'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['distributor', 'categories'],
    });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['categories'],
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
      product.distributor = distributor;
      delete updateProductDto.DistributorID;
    }

    if (updateProductDto.CategoryID) {
      const resolvedCategories = await Promise.all(
        updateProductDto.CategoryID.map(async (id) => {
          const category = await this.categoryRepository.findOne({
            where: { CategoryID: id },
          });
          if (!category) {
            throw new Error(`Category with ID ${id} not found`);
          }
          return category;
        }),
      );
      product.categories = resolvedCategories;
      delete updateProductDto.CategoryID;
    }

    Object.assign(product, updateProductDto);

    await this.productRepository.save(product);

    return this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['distributor', 'categories'],
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
