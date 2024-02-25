import { Test, TestingModule } from '@nestjs/testing';
import { DistributorRelationsService } from '../src/distributor-relations/distributor-relations.service';

describe('DistributorRelationsService', () => {
  let service: DistributorRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributorRelationsService],
    }).compile();

    service = module.get<DistributorRelationsService>(
      DistributorRelationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
