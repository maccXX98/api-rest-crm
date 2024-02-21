import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Distributor {
  @PrimaryGeneratedColumn()
  DistributorID: number;

  @Column({ length: 150 })
  Name: string;

  @Column({ length: 150 })
  Country: string;

  @Column({ length: 500 })
  Address: string;

  @Column({ length: 25 })
  ContactPhone: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Product, (product) => product.distributor, { lazy: true })
  products: Promise<Product[]>;
}
