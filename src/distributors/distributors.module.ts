import { Module } from '@nestjs/common';
import { DistributorsController } from './distributors.controller';
import { distributorProviders } from './distributor.providers';
import { DistributorsService } from './distributors.service';

@Module({
  controllers: [DistributorsController],
  providers: [...distributorProviders, DistributorsService],
  exports: [...distributorProviders],
})
export class DistributorsModule {}
