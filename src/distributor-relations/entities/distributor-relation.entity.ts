import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Distributor } from '../../distributors/entities/distributor.entity';

@Entity()
export class DistributorRelation {
  @PrimaryGeneratedColumn()
  DistributorRelationid: number;

  @Column()
  TotalOrders: number;

  @Column('decimal', { precision: 10, scale: 2 })
  TotalSpent: number;

  @Column()
  DistributorID: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(
    () => Distributor,
    (distributor) => distributor.distributorRelation,
    {
      lazy: true,
    },
  )
  @JoinColumn({ name: 'DistributorID' })
  distributor: Relation<Distributor>;
}
