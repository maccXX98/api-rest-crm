import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOrdersService } from './customer-orders.service';

describe('CustomerOrdersService', () => {
  let service: CustomerOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerOrdersService],
    }).compile();

    service = module.get<CustomerOrdersService>(CustomerOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
