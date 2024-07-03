import { Test, TestingModule } from '@nestjs/testing';
import { CustomerOrderDetailsService } from './customer-order-details.service';

describe('CustomerOrderDetailsService', () => {
  let service: CustomerOrderDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerOrderDetailsService],
    }).compile();

    service = module.get<CustomerOrderDetailsService>(CustomerOrderDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
