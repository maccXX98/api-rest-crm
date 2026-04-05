import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductOrdersController } from '../../src/product-orders/product-orders.controller';
import { ProductOrdersService } from '../../src/product-orders/product-orders.service';
import { ProductOrder } from '../../src/product-orders/entities/product-order.entity';
import { Distributor } from '../../src/distributors/entities/distributor.entity';
import { User } from '../../src/users/entities/user.entity';

describe('ProductOrdersController', () => {
  let controller: ProductOrdersController;

  const mockProductOrderRepository = {
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

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOrdersController],
      providers: [
        ProductOrdersService,
        {
          provide: getRepositoryToken(ProductOrder),
          useValue: mockProductOrderRepository,
        },
        {
          provide: getRepositoryToken(Distributor),
          useValue: mockDistributorRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductOrdersController>(ProductOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
