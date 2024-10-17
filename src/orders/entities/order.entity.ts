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
import { TipoVivienda } from 'src/directions/entities/tipo.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

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

  @Column({
    nullable: true,
  })
  receiptUrl?: string;

  @Column({
    nullable: true,
  })
  paymentId?: string;

  @Column('text', {
    nullable: true,
  })
  deliveryDate?: string;

  @Column({
    type: 'enum',
    enum: TipoVivienda,
  })
  tipo: TipoVivienda;

  @Column('text')
  pais: string;

  @Column('text')
  municipio: string;

  @Column('text')
  estado: string;

  @Column('text')
  calle: string;

  @Column('text')
  noExterior: string;

  @Column('text', { nullable: true })
  noInterior?: string;

  @Column('text')
  colonia: string;

  @Column('int')
  cp: number;

  @CreateDateColumn()
  createdAt: string;
}
