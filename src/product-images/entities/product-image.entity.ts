import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('increment')
  ProductImageID: number;

  @Column({ length: 500 })
  originalPath: string;

  @Column({ length: 500 })
  whatsappPath: string;

  @Column({ length: 500 })
  webPath: string;

  @Column({ length: 500 })
  thumbPath: string;

  @Column({ type: 'int', nullable: true })
  productId?: number;

  @Column({ type: 'int', nullable: true })
  productLinkId?: number;

  @Column({ type: 'int', nullable: true })
  jobId?: number;

  @Column({ type: 'int', nullable: true })
  originalSize?: number;

  @CreateDateColumn()
  createdAt: Date;
}
