import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImagesService {
  private readonly logger = new Logger(ProductImagesService.name);

  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(data: {
    originalPath: string;
    whatsappPath: string;
    webPath: string;
    thumbPath: string;
    productId?: number;
    productLinkId?: number;
    jobId?: number;
  }): Promise<ProductImage> {
    const image = this.productImageRepository.create(data);
    return this.productImageRepository.save(image);
  }

  async findById(id: number): Promise<ProductImage | null> {
    return this.productImageRepository.findOne({
      where: { ProductImageID: id },
      relations: ['product', 'productLink'],
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductLinkId(
    productLinkId: number,
  ): Promise<ProductImage | null> {
    return this.productImageRepository.findOne({
      where: { productLinkId },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number): Promise<void> {
    await this.productImageRepository.delete({ ProductImageID: id });
  }
}
