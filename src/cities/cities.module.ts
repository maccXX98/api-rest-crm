import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { citiesProviders } from './cities.providers';

@Module({
  controllers: [CitiesController],
  providers: [...citiesProviders, CitiesService],
  exports: [...citiesProviders],
})
export class CitiesModule {}
