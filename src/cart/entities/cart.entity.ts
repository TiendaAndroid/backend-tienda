import { User } from 'src/auth/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItems } from './cart-item.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItems, (cartItems) => cartItems.cart, {
    onDelete: 'CASCADE',
    eager: true,
  })
  cart_items: CartItems[];

  @CreateDateColumn()
  createdAt: string;
}
