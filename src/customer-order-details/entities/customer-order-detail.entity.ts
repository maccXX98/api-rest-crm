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
} from 'typeorm';

@Entity()
export class CustomerOrderDetail {
  @PrimaryGeneratedColumn()
  CustomerOrderDetailID: number;

  @Column()
  CustomerOrderID: number;

  @Column()
  ProductID: number;

  @Column()
  Quantity: number;

  @DeleteDateColumn()
  DeletedAt: Date;

  @CreateDateColumn()
  CreatedAt: Date;

  @ManyToOne(
    () => CustomerOrder,
    (customerOrder) => customerOrder.CustomerOrderID,
    { lazy: true },
  )
  customerOrder: Relation<CustomerOrder>;

  @ManyToOne(() => Product, (product) => product.ProductID, { lazy: true })
  product: Relation<Product>;
}
