import { DataSource } from 'typeorm';
import { ProductOrder } from './entities/product-order.entity';
import { DATA_SOURCE, PRODUCT_ORDER_REPOSITORY } from '../constants';

export const productOrderProviders = [
  {
    provide: PRODUCT_ORDER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductOrder),
    inject: [DATA_SOURCE],
  },
];
