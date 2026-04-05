import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { Inventory } from './entities/inventory.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), ProductsModule],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [TypeOrmModule.forFeature([Inventory]), InventoriesService],
})
export class InventoriesModule {}
