import { Inject, Injectable } from '@nestjs/common';
import { CreateProductLinkDto } from './dto/create-product-link.dto';
import { UpdateProductLinkDto } from './dto/update-product-link.dto';
import { PRODUCT_LINK_REPOSITORY, PRODUCT_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductLink } from './entities/product-link.entity';

@Injectable()
export class ProductLinksService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
    @Inject(PRODUCT_LINK_REPOSITORY)
    private productLinkRepository: Repository<ProductLink>,
  ) {}

  async create(
    createProductLinkDto: CreateProductLinkDto,
  ): Promise<ProductLink> {
    const newProductLink =
      this.productLinkRepository.create(createProductLinkDto);

    const product = await this.productRepository.findOne({
      where: { ProductID: createProductLinkDto.ProductId },
    });
    if (!product) {
      throw new Error(
        `Product with ID ${createProductLinkDto.ProductId} not found`,
      );
    }

    newProductLink.product = product;

    return this.productLinkRepository.save(newProductLink);
  }

  async findAll() {
    return this.productLinkRepository.find({ relations: ['product'] });
  }

  async findOne(id: number) {
    const productLink = await this.productLinkRepository.findOne({
      where: { ProductLinkID: id },
      relations: ['product'],
    });
    if (!productLink) {
      throw new Error('ProductLink not found');
    }

    return productLink;
  }

  async update(
    id: number,
    updateProductLinkDto: UpdateProductLinkDto,
  ): Promise<ProductLink> {
    const productLink = await this.productLinkRepository.findOne({
      where: { ProductLinkID: id },
      relations: ['product'],
    });
    if (!productLink) {
      throw new Error(`ProductLink with ID ${id} not found`);
    }

    if (updateProductLinkDto.ProductId) {
      const product = await this.productRepository.findOne({
        where: { ProductID: updateProductLinkDto.ProductId },
      });
      if (!product) {
        throw new Error(
          `Product with ID ${updateProductLinkDto.ProductId} not found`,
        );
      }
      productLink.product = product;
      delete updateProductLinkDto.ProductId;
    }

    Object.assign(productLink, updateProductLinkDto);

    await this.productLinkRepository.save(productLink);

    return this.productLinkRepository.findOne({
      where: { ProductLinkID: id },
      relations: ['product'],
    });
  }

  async remove(id: number) {
    const productLink = await this.productLinkRepository.findOne({
      where: { ProductLinkID: id },
    });
    if (!productLink) {
      throw new Error('ProductLink not found');
    }

    return this.productLinkRepository.softDelete(id);
  }
}
