import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ImageProcessingService } from '../image-processing/image-processing.service';
import { ImageJobData } from '../image-processing/interfaces/image-processing.interface';

@Injectable()
export class ProductImagesService {
  private readonly logger = new Logger(ProductImagesService.name);

  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @Inject(forwardRef(() => ImageProcessingService))
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  async create(data: {
    originalPath: string;
    whatsappPath: string;
    webPath: string;
    thumbPath: string;
    productId?: number;
    productLinkId?: number;
    jobId?: number;
    originalSize?: number;
  }): Promise<ProductImage> {
    const image = this.productImageRepository.create(data);
    return this.productImageRepository.save(image);
  }

  async findById(id: number): Promise<ProductImage | null> {
    return this.productImageRepository.findOne({
      where: { ProductImageID: id },
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPrimaryByProductId(
    productId: number,
  ): Promise<ProductImage | null> {
    return this.productImageRepository.findOne({
      where: { productId },
      order: { createdAt: 'ASC' },
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

  async processAndCreateProductImage(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    options: {
      productId?: number;
      productLinkId?: number;
      jobId?: number;
    },
  ): Promise<ProductImage> {
    const uuid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    this.logger.log(
      `Processing image for productId: ${options.productId}, linkId: ${options.productLinkId}`,
    );

    // Process image through Sharp (generates all versions)
    const jobData: ImageJobData = {
      productId: options.productId,
      productLinkId: options.productLinkId,
      fileBuffer,
      originalFilename,
      mimeType,
      uuid,
    };

    const result =
      await this.imageProcessingService.processProductImage(jobData);

    // Save to database
    const productImage = await this.create({
      originalPath: result.originalPath,
      whatsappPath: result.whatsappPath,
      webPath: result.webPath,
      thumbPath: result.thumbPath,
      productId: options.productId,
      productLinkId: options.productLinkId,
      jobId: options.jobId,
      originalSize: result.originalSize,
    });

    this.logger.log(
      `ProductImage created with ID: ${productImage.ProductImageID}`,
    );

    return productImage;
  }

  async getProductImageUrls(productId: number): Promise<{
    primary: ProductImage | null;
    all: ProductImage[];
  }> {
    const all = await this.findByProductId(productId);
    const primary = await this.findPrimaryByProductId(productId);
    return { primary, all };
  }
}
