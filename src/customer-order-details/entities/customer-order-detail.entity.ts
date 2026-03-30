import { CustomerOrder } from '../../customer-orders/entities/customer-order.entity';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  JoinColumn,
} from 'typeorm';

@Entity()
export class CustomerOrderDetail {
  @PrimaryGeneratedColumn('increment')
  CustomerOrderDetailID: number;

  @Column()
  Quantity: number;

  @DeleteDateColumn()
  DeletedAt: Date;

  @CreateDateColumn()
  CreatedAt: Date;

  @ManyToOne(
    () => CustomerOrder,
    (customerOrder) => customerOrder.customerOrderDetails,
    { lazy: true },
  )
  @JoinColumn({ name: 'CustomerOrderID' })
  customerOrder: Relation<CustomerOrder>;

  @ManyToOne(() => Product, (product) => product.customerOrderDetails, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;
}
