import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMetodsController } from './payment-metods.controller';
import { PaymentMetodsService } from './payment-metods.service';

describe('PaymentMetodsController', () => {
  let controller: PaymentMetodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMetodsController],
      providers: [PaymentMetodsService],
    }).compile();

    controller = module.get<PaymentMetodsController>(PaymentMetodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
