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
export class ProductVariant {
  @PrimaryGeneratedColumn()
  ProductVariantID: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 250 })
  variantName: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Product, (product) => product.productVariants, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;
}
