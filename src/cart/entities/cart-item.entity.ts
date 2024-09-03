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
import { Cart } from './cart.entity';
import { Product } from 'src/products/entities';

@Entity('cart_items')
export class CartItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cart_items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

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
