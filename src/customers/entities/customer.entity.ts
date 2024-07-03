import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
}
