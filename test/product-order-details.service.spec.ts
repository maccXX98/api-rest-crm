import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrderDetailsService } from '../src/product-order-details/product-order-details.service';

describe('ProductOrderDetailsService', () => {
  let service: ProductOrderDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOrderDetailsService],
    }).compile();

    service = module.get<ProductOrderDetailsService>(
      ProductOrderDetailsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
