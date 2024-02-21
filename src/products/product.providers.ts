import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { DATA_SOURCE, PRODUCT_REPOSITORY } from '../constants';

export const productProviders = [
  {
    provide: PRODUCT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DATA_SOURCE],
  },
];
