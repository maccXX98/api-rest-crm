import { Test, TestingModule } from '@nestjs/testing';
import { DistributorsController } from '../src/distributors/distributors.controller';
import { DistributorsService } from '../src/distributors/distributors.service';

describe('DistributorsController', () => {
  let controller: DistributorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorsController],
      providers: [DistributorsService],
    }).compile();

    controller = module.get<DistributorsController>(DistributorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
