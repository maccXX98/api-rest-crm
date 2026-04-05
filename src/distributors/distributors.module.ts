import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorsController } from './distributors.controller';
import { DistributorsService } from './distributors.service';
import { Distributor } from './entities/distributor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distributor])],
  controllers: [DistributorsController],
  providers: [DistributorsService],
  exports: [TypeOrmModule.forFeature([Distributor]), DistributorsService],
})
export class DistributorsModule {}
