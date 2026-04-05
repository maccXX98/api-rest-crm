import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';
import { CityVariation } from './entities/city-variation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, CityVariation])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [TypeOrmModule.forFeature([City, CityVariation]), CitiesService],
})
export class CitiesModule {}
