import { CustomerOrder } from '../../customer-orders/entities/customer-order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  PaymentMethodID: number;

  @Column({ length: 150 })
  method: string;

  @Column()
  template: string;

  @Column()
  image: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => CustomerOrder,
    (customerOrder) => customerOrder.paymentMethod,
  )
  customerOrders: CustomerOrder[];
}
