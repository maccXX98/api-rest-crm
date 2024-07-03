import { Price } from '../../prices/entities/price.entity';
import { Distributor } from '../../distributors/entities/distributor.entity';
import { ProductOrderDetail } from '../../product-order-details/entities/product-order-detail.entity';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { ProductLink } from '../../product-links/entities/product-link.entity';
import { ProductVariant } from '../../product-variants/entities/product-variant.entity';
import { CustomerOrderDetail } from '../../customer-order-details/entities/customer-order-detail.entity';
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
  CreateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;

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

  @OneToMany(() => ProductLink, (productLink) => productLink.product, {
    lazy: true,
  })
  @JoinColumn()
  productLinks: Relation<ProductLink>[];

  @OneToMany(() => ProductVariant, (ProductVariant) => ProductVariant.product, {
    lazy: true,
  })
  @JoinColumn()
  productVariants: Relation<ProductVariant>[];

  @OneToMany(
    () => CustomerOrderDetail,
    (customerOrderDetail) => customerOrderDetail.product,
    {
      lazy: true,
    },
  )
  @JoinColumn({ name: 'ProductID' })
  customerOrderDetails: Relation<CustomerOrderDetail>[];
}
