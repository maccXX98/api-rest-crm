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
export class City {
  @PrimaryGeneratedColumn()
  CityID: number;

  @Column({ length: 150 })
  city: string;

  @Column()
  template: string;

  @Column()
  image: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CustomerOrder, (customerOrder) => customerOrder.city)
  customerOrders: CustomerOrder[];
}
