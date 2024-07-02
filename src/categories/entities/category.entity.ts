import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column({ length: 150 })
  Name: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToMany(() => Product, (product) => product.categories, {
    lazy: true,
  })
  @JoinTable({
    name: 'products_categories',
    joinColumn: {
      name: 'CategoryID',
    },
    inverseJoinColumn: {
      name: 'ProductID',
    },
  })
  products: Relation<Product>[];
}
