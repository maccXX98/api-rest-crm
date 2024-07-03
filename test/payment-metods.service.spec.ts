import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMetodsService } from './payment-metods.service';

describe('PaymentMetodsService', () => {
  let service: PaymentMetodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMetodsService],
    }).compile();

    service = module.get<PaymentMetodsService>(PaymentMetodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
