import { Cart } from 'src/cart/entities/cart.entity';
import { Direction } from 'src/directions/entities/direction.entity';
import { Order } from 'src/orders/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Entidad del usuario creado para la base de datos
// Autor: Fidel Bonilla

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: true,
  })
  password?: string;

  @Column('text')
  name: string;

  @Column('text')
  lastName: string;

  @Column('text', {
    nullable: true,
  })
  googleId?: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @OneToMany(() => Direction, (direction) => direction.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  direction?: Direction;

  @OneToOne(() => Cart, (cart) => cart.user, {
    eager: true,
  })
  cart?: Cart;

  @OneToMany(() => Order, (order) => order.user, {
    eager: true,
  })
  orders?: Order[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert;
  }
}
