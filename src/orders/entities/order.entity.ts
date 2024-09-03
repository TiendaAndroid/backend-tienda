import {
     Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItems } from './orderItem.entity';
import { User } from 'src/auth/entities/user.entity';
import { ValidStatus } from '../interfaces/valid-status';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column('float')
  totalAmount: number

  @OneToMany(() => OrderItems, (order_items) => order_items.order, {
    onDelete: 'CASCADE',
    eager: true,
  })
  order_items: OrderItems[];

  @Column({
     type: 'enum',
     enum: ValidStatus,
     default: ValidStatus.pending,
  })
  status: ValidStatus;

  @CreateDateColumn()
  createdAt: string;
}
