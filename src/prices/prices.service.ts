import { Inject, Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PRICE_REPOSITORY, PRODUCT_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class PricesService {
  constructor(
    @Inject(PRICE_REPOSITORY)
    private priceRepository: Repository<Price>,
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
  ) {}

  async create(createPriceDto: CreatePriceDto): Promise<Price> {
    const newPrice = this.priceRepository.create(createPriceDto);
    const product = await this.productRepository.findOne({
      where: { ProductID: createPriceDto.ProductID },
    });
    if (!product) {
      throw new Error(`Product with ID ${createPriceDto.ProductID} not found`);
    }
    newPrice.product = Promise.resolve(product);

    return this.priceRepository.save(newPrice);
  }

  async findAll(): Promise<Price[]> {
    return this.priceRepository.find({
      relations: ['product'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Price> {
    return this.priceRepository.findOne({
      where: { PriceID: id },
      relations: ['product'],
    });
  }

  async update(id: number, updatePriceDto: UpdatePriceDto): Promise<Price> {
    const price = await this.priceRepository.findOne({
      where: { PriceID: id },
    });
    if (!price) {
      throw new Error(`Price with ID ${id} not found`);
    }

    if (updatePriceDto.ProductID) {
      const product = await this.productRepository.findOne({
        where: { ProductID: updatePriceDto.ProductID },
      });
      if (!product) {
        throw new Error(
          `Product with ID ${updatePriceDto.ProductID} not found`,
        );
      }
      price.product = Promise.resolve(product);
      delete updatePriceDto.ProductID;
    }

    await this.priceRepository.update({ PriceID: id }, updatePriceDto);
    return this.priceRepository.findOne({
      where: { PriceID: id },
      relations: ['product'],
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.priceRepository.softDelete({
      PriceID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`Price with ID ${id} not found`);
    }
  }
}
