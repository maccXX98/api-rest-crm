import { DataSource } from 'typeorm';
import { CustomerOrderDetail } from './entities/customer-order-detail.entity';
import { DATA_SOURCE, CUSTOMER_ORDER_DETAIL_REPOSITORY } from '../constants';

export const customerOrderDetailsProviders = [
  {
    provide: CUSTOMER_ORDER_DETAIL_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CustomerOrderDetail),
    inject: [DATA_SOURCE],
  },
];
