import { IsNotEmpty } from 'class-validator';
import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  InventoryID: number;

  @IsNotEmpty()
  @Column({ type: 'int' })
  quantity: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Product, (product) => product.inventories, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;
}
