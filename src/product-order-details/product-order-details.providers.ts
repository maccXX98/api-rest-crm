import { DataSource } from 'typeorm';
import { ProductOrderDetail } from './entities/product-order-detail.entity';
import { DATA_SOURCE, PRODUCT_ORDER_DETAIL_REPOSITORY } from '../constants';

export const productOrderDetailProviders = [
  {
    provide: PRODUCT_ORDER_DETAIL_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductOrderDetail),
    inject: [DATA_SOURCE],
  },
];
