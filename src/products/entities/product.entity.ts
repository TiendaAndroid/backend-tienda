import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

// Entidad del usuario creado para la base de datos
// Autor: Fidel Bonilla

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  price: number;

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    {
        cascade: true,
        eager: true
    }
)
  image?: ProductImage[];

  @Column('text', {
    array: true,
  })
  color: string[];

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @Column('float')
  discount: number;

  @Column('text', {
    array: true,
  })
  material: string[];

  @Column('float', {
    array: true,
  })
  size: number[];

  @Column('int')
  stock: number;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
