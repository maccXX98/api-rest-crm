import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
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

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.user, {
    lazy: true,
  })
  productOrders: ProductOrder[];
}
