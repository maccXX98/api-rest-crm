import { IsNotEmpty } from 'class-validator';
import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity()
export class ProductLink {
  @PrimaryGeneratedColumn()
  ProductLinkID: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 250 })
  link: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Product, (product) => product.productLinks, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;
}
