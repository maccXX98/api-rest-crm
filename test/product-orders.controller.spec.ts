import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrdersController } from '../src/product-orders/product-orders.controller';
import { ProductOrdersService } from '../src/product-orders/product-orders.service';

describe('ProductOrdersController', () => {
  let controller: ProductOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOrdersController],
      providers: [ProductOrdersService],
    }).compile();

    controller = module.get<ProductOrdersController>(ProductOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
