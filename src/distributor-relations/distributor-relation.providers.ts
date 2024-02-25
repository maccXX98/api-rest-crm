import { DataSource } from 'typeorm';
import { DistributorRelation } from './entities/distributor-relation.entity';
import { DATA_SOURCE, DISTRIBUTOR_RELATION_REPOSITORY } from '../constants';

export const distributorRelationProviders = [
  {
    provide: DISTRIBUTOR_RELATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DistributorRelation),
    inject: [DATA_SOURCE],
  },
];
