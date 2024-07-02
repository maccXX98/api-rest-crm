import { DataSource } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { DATA_SOURCE, PRODUCT_VARIANT_REPOSITORY } from '../constants';

export const productVariantProviders = [
  {
    provide: PRODUCT_VARIANT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductVariant),
    inject: [DATA_SOURCE],
  },
];
