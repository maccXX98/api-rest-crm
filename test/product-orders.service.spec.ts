import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrdersService } from '../src/product-orders/product-orders.service';

describe('ProductOrdersService', () => {
  let service: ProductOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOrdersService],
    }).compile();

    service = module.get<ProductOrdersService>(ProductOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
