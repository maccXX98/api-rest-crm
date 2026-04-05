import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductLinksController } from '../../src/product-links/product-links.controller';
import { ProductLinksService } from '../../src/product-links/product-links.service';
import { ProductLink } from '../../src/product-links/entities/product-link.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('ProductLinksController', () => {
  let controller: ProductLinksController;

  const mockProductLinkRepository = {
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
      controllers: [ProductLinksController],
      providers: [
        ProductLinksService,
        {
          provide: getRepositoryToken(ProductLink),
          useValue: mockProductLinkRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductLinksController>(ProductLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
