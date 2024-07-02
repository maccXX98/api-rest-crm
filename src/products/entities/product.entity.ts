import { Price } from '../../prices/entities/price.entity';
import { Distributor } from '../../distributors/entities/distributor.entity';
import { ProductOrderDetail } from '../../product-order-details/entities/product-order-detail.entity';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  ProductID: number;

  @IsNotEmpty()
  @Column({ length: 150 })
  Name: string;

  @Column({ length: 150 })
  NickName: string;

  @Column('text')
  Description: string;

  @Column('text')
  Template: string;

  @Column({ length: 150 })
  Image: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Distributor, (distributor) => distributor.products, {
    lazy: true,
  })
  @JoinColumn({ name: 'DistributorID' })
  distributor: Relation<Distributor>;

  @OneToMany(
    () => ProductOrderDetail,
    (productOrderDetail) => productOrderDetail.product,
    {
      lazy: true,
    },
  )
  @JoinColumn()
  productOrderDetail: Relation<ProductOrderDetail>[];

  @OneToMany(() => Price, (prices) => prices.product, {
    lazy: true,
  })
  @JoinColumn()
  productPrices: Relation<Price>[];

  @ManyToMany(() => Category, (category) => category.products, {
    lazy: true,
  })
  categories: Relation<Category>[];

  @OneToMany(() => Inventory, (inventory) => inventory.product, {
    lazy: true,
  })
  @JoinColumn()
  inventories: Relation<Inventory>[];
}
