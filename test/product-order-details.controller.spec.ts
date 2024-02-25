import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrderDetailsController } from '../src/product-order-details/product-order-details.controller';
import { ProductOrderDetailsService } from '../src/product-order-details/product-order-details.service';

describe('ProductOrderDetailsController', () => {
  let controller: ProductOrderDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOrderDetailsController],
      providers: [ProductOrderDetailsService],
    }).compile();

    controller = module.get<ProductOrderDetailsController>(
      ProductOrderDetailsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
