import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { inventoryProviders } from './inventory.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [InventoriesController],
  providers: [...inventoryProviders, InventoriesService],
  exports: [...inventoryProviders],
})
export class InventoriesModule {}
