import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { DATA_SOURCE, CATEGORY_REPOSITORY } from '../constants';

export const categoryProviders = [
  {
    provide: CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DATA_SOURCE],
  },
];
