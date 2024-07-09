import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @Column({ length: 150 })
  FirstName: string;

  @Column({ length: 150 })
  LastName: string;

  @Column({ length: 25 })
  Phone: string;

  @Column({ type: 'binary', nullable: true })
  Photo: Buffer;

  @Column({ length: 100 })
  Role: string;

  @Column({ length: 150 })
  Username: string;

  @Column({ length: 100 })
  Email: string;

  @Column({ length: 150 })
  Password: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.user, {
    lazy: true,
  })
  productOrders: ProductOrder[];
}
