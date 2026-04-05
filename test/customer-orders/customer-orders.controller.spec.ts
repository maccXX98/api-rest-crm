import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerOrdersController } from '../../src/customer-orders/customer-orders.controller';
import { CustomerOrdersService } from '../../src/customer-orders/customer-orders.service';
import { CustomerOrder } from '../../src/customer-orders/entities/customer-order.entity';
import { Customer } from '../../src/customers/entities/customer.entity';
import { City } from '../../src/cities/entities/city.entity';
import { PaymentMethod } from '../../src/payment-metods/entities/payment-metod.entity';

describe('CustomerOrdersController', () => {
  let controller: CustomerOrdersController;

  const mockCustomerOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
  };

  const mockCityRepository = {
    findOne: jest.fn(),
  };

  const mockPaymentMethodRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrdersController],
      providers: [
        CustomerOrdersService,
        {
          provide: getRepositoryToken(CustomerOrder),
          useValue: mockCustomerOrderRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: mockPaymentMethodRepository,
        },
      ],
    }).compile();

    controller = module.get<CustomerOrdersController>(CustomerOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
