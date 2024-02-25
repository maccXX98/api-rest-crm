import { DistributorRelation } from '../../distributor-relations/entities/distributor-relation.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
  Relation,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Distributor {
  @PrimaryGeneratedColumn()
  DistributorID: number;

  @Column({ length: 150 })
  Name: string;

  @Column({ length: 150 })
  Country: string;

  @Column({ length: 500 })
  Address: string;

  @Column({ length: 25 })
  ContactPhone: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Product, (product) => product.distributor, { lazy: true })
  @JoinColumn()
  products: Relation<Product>[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.distributor, {
    lazy: true,
  })
  @JoinColumn()
  productOrders: Relation<ProductOrder>[];

  @OneToMany(
    () => DistributorRelation,
    (distributorRelation) => distributorRelation.DistributorID,
    {
      lazy: true,
    },
  )
  @JoinColumn()
  distributorRelation: Relation<DistributorRelation>[];
}
