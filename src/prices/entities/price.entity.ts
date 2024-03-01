import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  PriceID: number;

  @Column('decimal', { precision: 10, scale: 2 })
  Cost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  SellingPrice: number;

  @Column()
  Currency: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Product, (product) => product.productPrices, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Promise<Product>;
}
