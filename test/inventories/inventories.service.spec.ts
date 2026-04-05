import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoriesService } from '../../src/inventories/inventories.service';
import { Inventory } from '../../src/inventories/entities/inventory.entity';
import { Product } from '../../src/products/entities/product.entity';

describe('InventoriesService', () => {
  let service: InventoriesService;

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

    service = module.get<InventoriesService>(InventoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
