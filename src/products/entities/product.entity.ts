import { IsNotEmpty } from 'class-validator';
import { Distributor } from '../../distributors/entities/distributor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  ProductID: number;

  @IsNotEmpty()
  @Column({ length: 150 })
  Name: string;

  @Column({ length: 150 })
  NickName: string;

  @Column('text')
  Description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  Cost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  SellingPrice: number;

  @Column('text')
  Template: string;

  @Column({ length: 150 })
  Image: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Distributor, (distributor) => distributor.products, {
    lazy: true,
  })
  @JoinColumn({ name: 'DistributorID' })
  distributor: Promise<Distributor>;
}
