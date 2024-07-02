import { DataSource } from 'typeorm';
import { ProductLink } from './entities/product-link.entity';
import { DATA_SOURCE, PRODUCT_LINK_REPOSITORY } from '../constants';

export const productLinkProviders = [
  {
    provide: PRODUCT_LINK_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductLink),
    inject: [DATA_SOURCE],
  },
];
