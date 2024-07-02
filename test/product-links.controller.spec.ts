import { Test, TestingModule } from '@nestjs/testing';
import { ProductLinksController } from '../src/product-links/product-links.controller';
import { ProductLinksService } from '../src/product-links/product-links.service';

describe('ProductLinksController', () => {
  let controller: ProductLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductLinksController],
      providers: [ProductLinksService],
    }).compile();

    controller = module.get<ProductLinksController>(ProductLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
