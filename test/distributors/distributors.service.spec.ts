import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistributorsService } from '../../src/distributors/distributors.service';
import { Distributor } from '../../src/distributors/entities/distributor.entity';

describe('DistributorsService', () => {
  let service: DistributorsService;

  const mockDistributorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributorsService,
        {
          provide: getRepositoryToken(Distributor),
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    service = module.get<DistributorsService>(DistributorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
