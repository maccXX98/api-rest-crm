import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentMetodsController } from '../../src/payment-metods/payment-metods.controller';
import { PaymentMetodsService } from '../../src/payment-metods/payment-metods.service';
import { PaymentMethod } from '../../src/payment-metods/entities/payment-metod.entity';

describe('PaymentMetodsController', () => {
  let controller: PaymentMetodsController;

  const mockPaymentMethodRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMetodsController],
      providers: [
        PaymentMetodsService,
        {
          provide: getRepositoryToken(PaymentMethod),
          useValue: mockPaymentMethodRepository,
        },
      ],
    }).compile();

    controller = module.get<PaymentMetodsController>(PaymentMetodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
