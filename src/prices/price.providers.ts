import { DataSource } from 'typeorm';
import { Price } from './entities/price.entity';
import { DATA_SOURCE, PRICE_REPOSITORY } from '../constants';

export const priceProviders = [
  {
    provide: PRICE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Price),
    inject: [DATA_SOURCE],
  },
];
