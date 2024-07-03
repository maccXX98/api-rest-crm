import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
}
