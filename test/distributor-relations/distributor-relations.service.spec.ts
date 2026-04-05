import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistributorRelationsService } from '../../src/distributor-relations/distributor-relations.service';
import { DistributorRelation } from '../../src/distributor-relations/entities/distributor-relation.entity';
import { ProductOrder } from '../../src/product-orders/entities/product-order.entity';
import { ProductOrderDetail } from '../../src/product-order-details/entities/product-order-detail.entity';

describe('DistributorRelationsService', () => {
  let service: DistributorRelationsService;

  const mockDistributorRelationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockProductOrderDetailRepository = {
    find: jest.fn(),
  };

  const mockProductOrderRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributorRelationsService,
        {
          provide: getRepositoryToken(ProductOrder),
          useValue: mockProductOrderRepository,
        },
        {
          provide: getRepositoryToken(ProductOrderDetail),
          useValue: mockProductOrderDetailRepository,
        },
        {
          provide: getRepositoryToken(DistributorRelation),
          useValue: mockDistributorRelationRepository,
        },
      ],
    }).compile();

    service = module.get<DistributorRelationsService>(
      DistributorRelationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
