import { DataSource } from 'typeorm';
import { Distributor } from './entities/distributor.entity';
import { DATA_SOURCE, DISTRIBUTOR_REPOSITORY } from '../constants';

export const distributorProviders = [
  {
    provide: DISTRIBUTOR_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Distributor),
    inject: [DATA_SOURCE],
  },
];
