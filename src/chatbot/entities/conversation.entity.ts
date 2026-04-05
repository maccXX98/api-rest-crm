import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ConversationStep } from './conversation-step.enum';

export { ConversationStep };

@Entity('conversations')
@Index(['phone', 'currentStep'])
export class Conversation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ConversationStep,
    default: ConversationStep.IDLE,
  })
  currentStep: ConversationStep;

  @Column({ nullable: true })
  lastProductId: number;

  @Column({ nullable: true })
  lastWaMessageId: string;

  @Column({ nullable: true })
  lastWaMessageTimestamp: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    customerId?: number;
    cityId?: number;
    paymentMethodId?: number;
    [key: string]: unknown;
  };

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
