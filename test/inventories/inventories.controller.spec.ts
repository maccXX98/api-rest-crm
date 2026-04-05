import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoriesController } from '../../src/inventories/inventories.controller';
import { InventoriesService } from '../../src/inventories/inventories.service';
import { Inventory } from '../../src/inventories/entities/inventory.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('InventoriesController', () => {
  let controller: InventoriesController;

  const mockInventoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoriesController],
      providers: [
        InventoriesService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<InventoriesController>(InventoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
