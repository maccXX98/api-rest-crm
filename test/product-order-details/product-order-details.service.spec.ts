import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductOrderDetailsService } from '../../src/product-order-details/product-order-details.service';
import { ProductOrderDetail } from '../../src/product-order-details/entities/product-order-detail.entity';
import { ProductOrder } from '../../src/product-orders/entities/product-order.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('ProductOrderDetailsService', () => {
  let service: ProductOrderDetailsService;

  const mockProductOrderDetailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockProductOrderRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductOrderDetailsService,
        {
          provide: getRepositoryToken(ProductOrderDetail),
          useValue: mockProductOrderDetailRepository,
        },
        {
          provide: getRepositoryToken(ProductOrder),
          useValue: mockProductOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductOrderDetailsService>(
      ProductOrderDetailsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
