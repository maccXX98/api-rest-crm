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
export class Customer {
  @PrimaryGeneratedColumn()
  CustomerID: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  phone: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CustomerOrder, (customerOrder) => customerOrder.customer)
  customerOrders: CustomerOrder[];
}
