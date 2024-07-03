import { DataSource } from 'typeorm';
import { CustomerOrder } from './entities/customer-order.entity';
import { DATA_SOURCE, CUSTOMER_ORDER_REPOSITORY } from '../constants';

export const customerOrdersProviders = [
  {
    provide: CUSTOMER_ORDER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CustomerOrder),
    inject: [DATA_SOURCE],
  },
];
