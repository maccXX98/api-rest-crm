import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistributorsController } from '../../src/distributors/distributors.controller';
import { DistributorsService } from '../../src/distributors/distributors.service';
import { Distributor } from '../../src/distributors/entities/distributor.entity';

describe('DistributorsController', () => {
  let controller: DistributorsController;

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
      controllers: [DistributorsController],
      providers: [
        DistributorsService,
        {
          provide: getRepositoryToken(Distributor),
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    controller = module.get<DistributorsController>(DistributorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
