import { DataSource } from 'typeorm';
import { City } from './entities/city.entity';
import { DATA_SOURCE, CITY_REPOSITORY } from '../constants';

export const citiesProviders = [
  {
    provide: CITY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(City),
    inject: [DATA_SOURCE],
  },
];
