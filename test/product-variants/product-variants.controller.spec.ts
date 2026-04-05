import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductVariantsController } from '../../src/product-variants/product-variants.controller';
import { ProductVariantsService } from '../../src/product-variants/product-variants.service';
import { ProductVariant } from '../../src/product-variants/entities/product-variant.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('ProductVariantsController', () => {
  let controller: ProductVariantsController;

  const mockProductVariantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantsController],
      providers: [
        ProductVariantsService,
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: mockProductVariantRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductVariantsController>(
      ProductVariantsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
