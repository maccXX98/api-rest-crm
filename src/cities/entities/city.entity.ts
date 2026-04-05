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
  @PrimaryGeneratedColumn('increment')
  CityID: number;

  @Column({ length: 150 })
  city: string;

  @Column({ type: 'text', nullable: true })
  variations: string;

  @Column({ default: false })
  cashOnDelivery: boolean;

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
