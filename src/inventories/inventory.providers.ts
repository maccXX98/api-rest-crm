import { DataSource } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { DATA_SOURCE, INVENTORY_REPOSITORY } from '../constants';

export const inventoryProviders = [
  {
    provide: INVENTORY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Inventory),
    inject: [DATA_SOURCE],
  },
];
