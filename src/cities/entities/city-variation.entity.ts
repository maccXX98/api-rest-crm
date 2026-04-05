import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('city_variation')
@Index(['variation'])
export class CityVariation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  variation: string;

  @Column({ name: 'city_id' })
  cityId: number;

  @ManyToOne('City', 'variationsRelation', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: any;

  @DeleteDateColumn()
  deletedAt?: Date;
}
