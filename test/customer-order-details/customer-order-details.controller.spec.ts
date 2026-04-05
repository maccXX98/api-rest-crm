import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerOrderDetailsController } from '../../src/customer-order-details/customer-order-details.controller';
import { CustomerOrderDetailsService } from '../../src/customer-order-details/customer-order-details.service';
import { CustomerOrderDetail } from '../../src/customer-order-details/entities/customer-order-detail.entity';
import { CustomerOrder } from '../../src/customer-orders/entities/customer-order.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('CustomerOrderDetailsController', () => {
  let controller: CustomerOrderDetailsController;

  const mockCustomerOrderDetailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockCustomerOrderRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrderDetailsController],
      providers: [
        CustomerOrderDetailsService,
        {
          provide: getRepositoryToken(CustomerOrderDetail),
          useValue: mockCustomerOrderDetailRepository,
        },
        {
          provide: getRepositoryToken(CustomerOrder),
          useValue: mockCustomerOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<CustomerOrderDetailsController>(
      CustomerOrderDetailsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
