import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOrdersController } from './customer-orders.controller';
import { CustomerOrdersService } from './customer-orders.service';

describe('CustomerOrdersController', () => {
  let controller: CustomerOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrdersController],
      providers: [CustomerOrdersService],
    }).compile();

    controller = module.get<CustomerOrdersController>(CustomerOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
