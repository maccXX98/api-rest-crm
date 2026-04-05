import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '../../src/products/products.service';
import { Product } from '../../src/products/entities/product.entity';
import { Distributor } from '../../src/distributors/entities/distributor.entity';
import { Category } from '../../src/categories/entities/category.entity';
import { ProductImagesService } from '../../src/product-images/product-images.service';

describe('ProductsService', () => {
  let service: ProductsService;

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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
