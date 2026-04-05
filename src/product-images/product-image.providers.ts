import { DataSource } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { DATA_SOURCE, PRODUCT_IMAGE_REPOSITORY } from '../constants';

export const productImageProviders = [
  {
    provide: PRODUCT_IMAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductImage),
    inject: [DATA_SOURCE],
  },
];
