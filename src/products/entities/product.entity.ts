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
  OneToMany,
  ManyToMany,
  JoinColumn,
  Relation,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
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

  // =========================================
  // Owning side: @ManyToOne (has @JoinColumn)
  // =========================================
  @ManyToOne(() => Distributor, (distributor) => distributor.products, {
    lazy: true,
  })
  @JoinColumn({ name: 'DistributorID' })
  distributor: Relation<Distributor>;

  // =========================================
  // Inverse side: @OneToMany (NO @JoinColumn)
  // =========================================
  @OneToMany(
    () => ProductOrderDetail,
    (productOrderDetail) => productOrderDetail.product,
    { lazy: true },
  )
  productOrderDetails: Relation<ProductOrderDetail>[];

  @OneToMany(() => Price, (prices) => prices.product, { lazy: true })
  productPrices: Relation<Price>[];

  @ManyToMany(() => Category, (category) => category.products, {
    lazy: true,
  })
  categories: Relation<Category>[];

  @OneToMany(
    () => Inventory,
    (inventory) => inventory.product,
    { lazy: true },
  )
  inventories: Relation<Inventory>[];

  @OneToMany(
    () => ProductLink,
    (productLink) => productLink.product,
    { lazy: true },
  )
  productLinks: Relation<ProductLink>[];

  @OneToMany(
    () => ProductVariant,
    (pv) => pv.product,
    { lazy: true },
  )
  productVariants: Relation<ProductVariant>[];

  @OneToMany(
    () => CustomerOrderDetail,
    (cod) => cod.product,
    { lazy: true },
  )
  customerOrderDetails: Relation<CustomerOrderDetail>[];
}
