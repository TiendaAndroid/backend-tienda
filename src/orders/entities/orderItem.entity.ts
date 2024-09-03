import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities';

@Entity('order_item')
export class OrderItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.order_items, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @OneToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  product: Product;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  added_at: string;
}
