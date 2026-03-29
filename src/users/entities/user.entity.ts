import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enum';

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

  @Column({ type: 'bytea', nullable: true })
  Photo: Buffer;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SALES,
  })
  Role: Role;

  @Index()
  @Column({ length: 150 })
  Username: string;

  @Index()
  @Column({ length: 100 })
  Email: string;

  @Exclude()
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
