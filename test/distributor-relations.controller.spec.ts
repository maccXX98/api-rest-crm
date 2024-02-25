import { Test, TestingModule } from '@nestjs/testing';
import { DistributorRelationsController } from '../src/distributor-relations/distributor-relations.controller';
import { DistributorRelationsService } from '../src/distributor-relations/distributor-relations.service';

describe('DistributorRelationsController', () => {
  let controller: DistributorRelationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorRelationsController],
      providers: [DistributorRelationsService],
    }).compile();

    controller = module.get<DistributorRelationsController>(
      DistributorRelationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
