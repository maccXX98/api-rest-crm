import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { MessageDirection } from './message-direction.enum';

@Entity('message_logs')
@Index(['phone', 'createdAt'])
@Index(['waMessageId'])
export class MessageLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: MessageDirection })
  direction: MessageDirection;

  @Index()
  @Column({ length: 20 })
  phone: string;

  @Column({ length: 50 })
  messageType: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  waMessageId: string;

  @Column({ nullable: true })
  waMessageTimestamp: string;

  @Column({ type: 'jsonb', nullable: true })
  rawPayload: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
