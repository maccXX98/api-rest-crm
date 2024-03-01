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
    cascade: true,
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'CategoryID',
      referencedColumnName: 'CategoryID',
    },
    inverseJoinColumn: {
      name: 'ProductID',
      referencedColumnName: 'ProductID',
    },
  })
  products: Relation<Product>[];
}
