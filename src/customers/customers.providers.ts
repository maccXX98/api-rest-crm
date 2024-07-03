import { DataSource } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { DATA_SOURCE, CUSTOMER_REPOSITORY } from '../constants';

export const customerProviders = [
  {
    provide: CUSTOMER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Customer),
    inject: [DATA_SOURCE],
  },
];
