import { Inject, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { INVENTORY_REPOSITORY, PRODUCT_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoriesService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productRepository: Repository<Product>,
    @Inject(INVENTORY_REPOSITORY)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const newInventory = this.inventoryRepository.create(createInventoryDto);

    const product = await this.productRepository.findOne({
      where: { ProductID: createInventoryDto.ProductId },
    });
    if (!product) {
      throw new Error(
        `Product with ID ${createInventoryDto.ProductId} not found`,
      );
    }

    newInventory.product = product;

    return this.inventoryRepository.save(newInventory);
  }

  async findAll() {
    return this.inventoryRepository.find({ relations: ['product'] });
  }

  async findOne(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { InventoryID: id },
      relations: ['product'],
    });
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    return inventory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { InventoryID: id },
      relations: ['product'],
    });
    if (!inventory) {
      throw new Error(`Inventory with ID ${id} not found`);
    }

    if (updateInventoryDto.ProductId) {
      const product = await this.productRepository.findOne({
        where: { ProductID: updateInventoryDto.ProductId },
      });
      if (!product) {
        throw new Error(
          `Product with ID ${updateInventoryDto.ProductId} not found`,
        );
      }
      inventory.product = product;
      delete updateInventoryDto.ProductId;
    }

    Object.assign(inventory, updateInventoryDto);

    await this.inventoryRepository.save(inventory);

    return this.inventoryRepository.findOne({
      where: { InventoryID: id },
      relations: ['product'],
    });
  }

  async remove(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { InventoryID: id },
    });
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    return this.inventoryRepository.softDelete(id);
  }
}
