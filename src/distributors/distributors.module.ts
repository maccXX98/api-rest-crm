import { Module } from '@nestjs/common';
import { DistributorsController } from './distributors.controller';
import { DatabaseModule } from '../database/database.module';
import { distributorProviders } from './distributor.providers';
import { DistributorsService } from './distributors.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DistributorsController],
  providers: [...distributorProviders, DistributorsService],
  exports: [...distributorProviders],
})
export class DistributorsModule {}
