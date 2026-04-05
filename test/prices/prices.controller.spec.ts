import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PricesController } from '../../src/prices/prices.controller';
import { PricesService } from '../../src/prices/prices.service';
import { Price } from '../../src/prices/entities/price.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('PricesController', () => {
  let controller: PricesController;

  const mockPriceRepository = {
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
      controllers: [PricesController],
      providers: [
        PricesService,
        {
          provide: getRepositoryToken(Price),
          useValue: mockPriceRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<PricesController>(PricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
