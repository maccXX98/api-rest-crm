import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsController } from '../../src/products/products.controller';
import { ProductsService } from '../../src/products/products.service';
import { Product } from '../../src/products/entities/product.entity';
import { Distributor } from '../../src/distributors/entities/distributor.entity';
import { Category } from '../../src/categories/entities/category.entity';
import { ProductImagesService } from '../../src/product-images/product-images.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockDistributorRepository = {
    findOne: jest.fn(),
  };

  const mockCategoryRepository = {
    findBy: jest.fn(),
    findOne: jest.fn(),
  };

  const mockProductImagesService = {
    processAndCreateProductImage: jest.fn(),
    getProductImageUrls: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Distributor),
          useValue: mockDistributorRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: ProductImagesService,
          useValue: mockProductImagesService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
