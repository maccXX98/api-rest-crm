import { Distributor } from '../../distributors/entities/distributor.entity';
import { User } from '../../users/entities/user.entity';
import { ProductOrderDetail } from '../../product-order-details/entities/product-order-detail.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn()
  ProductOrderID: number;

  @Column({ type: 'uuid' })
  UserID: string;

  @Column()
  DistributorID: number;

  @Column({ type: 'date' })
  OrderDate: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.productOrders, { lazy: true })
  @JoinColumn({ name: 'UserID' })
  user: Relation<User>;

  @ManyToOne(() => Distributor, (distributor) => distributor.productOrders, {
    lazy: true,
  })
  @JoinColumn({ name: 'DistributorID' })
  distributor: Relation<Distributor>;

  @OneToMany(
    () => ProductOrderDetail,
    (productOrderDetail) => productOrderDetail.productOrder,
    { lazy: true },
  )
  @JoinColumn()
  productOrderDetails: Relation<ProductOrderDetail>[];
}
