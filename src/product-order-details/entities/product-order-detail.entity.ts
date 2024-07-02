import { Product } from '../../products/entities/product.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  Relation,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ProductOrderDetail {
  @PrimaryGeneratedColumn()
  ProductOrderDetailID: number;

  @Column()
  ProductID: number;

  @Column()
  ProductOrderID: number;

  @Column()
  Quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  TotalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Product, (product) => product.productOrderDetail, {
    lazy: true,
  })
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;

  @ManyToOne(
    () => ProductOrder,
    (productOrder) => productOrder.productOrderDetails,
    {
      lazy: true,
    },
  )
  @JoinColumn({ name: 'ProductOrderID' })
  productOrder: Relation<ProductOrder>;
}
