import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOrderDetailsController } from './customer-order-details.controller';
import { CustomerOrderDetailsService } from './customer-order-details.service';

describe('CustomerOrderDetailsController', () => {
  let controller: CustomerOrderDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrderDetailsController],
      providers: [CustomerOrderDetailsService],
    }).compile();

    controller = module.get<CustomerOrderDetailsController>(CustomerOrderDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
