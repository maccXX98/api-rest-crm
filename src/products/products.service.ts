import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Distributor } from '../distributors/entities/distributor.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductImagesService } from '../product-images/product-images.service';
import { ProductImage } from '../product-images/entities/product-image.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Distributor)
    private distributorRepository: Repository<Distributor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly productImagesService: ProductImagesService,
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

    const updatedProduct = await this.productRepository.findOne({
      where: { ProductID: id },
      relations: ['distributor', 'categories'],
    });
    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productRepository.softDelete({
      ProductID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`Product with ID ${id} not found`);
    }
  }

  // =========================================
  // Image Processing Methods
  // =========================================

  async addProductImage(
    productId: number,
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
  ): Promise<ProductImage> {
    const product = await this.findOne(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    this.logger.log(
      `Adding image to product ${productId}: ${originalFilename}`,
    );

    return this.productImagesService.processAndCreateProductImage(
      fileBuffer,
      originalFilename,
      mimeType,
      { productId },
    );
  }

  async getProductImages(
    productId: number,
  ): Promise<{ primary: ProductImage | null; all: ProductImage[] }> {
    return this.productImagesService.getProductImageUrls(productId);
  }

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    const image = await this.productImagesService.findById(imageId);
    if (!image || image.productId !== productId) {
      throw new Error(`Image ${imageId} not found for product ${productId}`);
    }
    await this.productImagesService.delete(imageId);
  }
}
