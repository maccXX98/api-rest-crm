import { City } from '../../cities/entities/city.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { PaymentMethod } from '../../payment-metods/entities/payment-metod.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class CustomerOrder {
  @PrimaryGeneratedColumn()
  CustomerOrderID: number;

  @Column()
  CustomerID: number;

  @Column()
  CityID: number;

  @Column()
  PaymentMethodID: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => City, (city) => city.customerOrders, { lazy: true })
  @JoinColumn({ name: 'CityID' })
  city: Relation<City>;

  @ManyToOne(
    () => PaymentMethod,
    (PaymentMethod) => PaymentMethod.customerOrders,
    { lazy: true },
  )
  @JoinColumn({ name: 'PaymentMethodID' })
  paymentMethod: Relation<PaymentMethod>;

  @ManyToOne(() => Customer, (customer) => customer.customerOrders, {
    lazy: true,
  })
  @JoinColumn({ name: 'CustomerID' })
  customer: Relation<Customer>;
}
