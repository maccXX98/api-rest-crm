import { Inject, Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PRODUCT_VARIANT_REPOSITORY, PRODUCT_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';

@Injectable()
export class ProductVariantsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async create(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    const newProductVariant = this.productVariantRepository.create(
      createProductVariantDto,
    );

    const product = await this.productRepository.findOne({
      where: { ProductID: createProductVariantDto.ProductId },
    });
    if (!product) {
      throw new Error(
        `Product with ID ${createProductVariantDto.ProductId} not found`,
      );
    }

    newProductVariant.product = product;

    return this.productVariantRepository.save(newProductVariant);
  }

  async findAll() {
    return this.productVariantRepository.find({ relations: ['product'] });
  }

  async findOne(id: number) {
    const productVariant = await this.productVariantRepository.findOne({
      where: { ProductVariantID: id },
      relations: ['product'],
    });
    if (!productVariant) {
      throw new Error('ProductVariant not found');
    }

    return productVariant;
  }

  async update(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { ProductVariantID: id },
      relations: ['product'],
    });
    if (!productVariant) {
      throw new Error(`ProductVariant with ID ${id} not found`);
    }

    if (updateProductVariantDto.ProductId) {
      const product = await this.productRepository.findOne({
        where: { ProductID: updateProductVariantDto.ProductId },
      });
      if (!product) {
        throw new Error(
          `Product with ID ${updateProductVariantDto.ProductId} not found`,
        );
      }
      productVariant.product = product;
      delete updateProductVariantDto.ProductId;
    }

    Object.assign(productVariant, updateProductVariantDto);

    await this.productVariantRepository.save(productVariant);

    return this.productVariantRepository.findOne({
      where: { ProductVariantID: id },
      relations: ['product'],
    });
  }

  async remove(id: number) {
    const productVariant = await this.productVariantRepository.findOne({
      where: { ProductVariantID: id },
    });
    if (!productVariant) {
      throw new Error('ProductVariant not found');
    }

    return this.productVariantRepository.softDelete(id);
  }
}
