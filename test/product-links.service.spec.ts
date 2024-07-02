import { Test, TestingModule } from '@nestjs/testing';
import { ProductLinksService } from '../src/product-links/product-links.service';

describe('ProductLinksService', () => {
  let service: ProductLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLinksService],
    }).compile();

    service = module.get<ProductLinksService>(ProductLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
