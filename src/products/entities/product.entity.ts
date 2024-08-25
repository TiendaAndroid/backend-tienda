import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

/**
 * Entidad que representa un producto en el sistema.
 *
 * Esta entidad almacena información sobre los productos, incluyendo su precio, nombre, descripción,
 * imágenes asociadas, y otros detalles relevantes. La entidad también gestiona las relaciones con
 * otras entidades, como las imágenes del producto.
 * 
 *
 * @author Fidel Bonilla
 */

@Entity('products')
export class Product {
  /**
   * Identificador único del producto, generado automáticamente como UUID.
   *
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Precio del producto.
   *
   * @type {number}
   */
  @Column('float')
  price: number;

  /**
   * Lista de imágenes asociadas al producto.
   *
   * Relación uno a muchos con la entidad `ProductImage`. La opción `cascade` permite guardar o eliminar
   * imágenes automáticamente junto con el producto. La opción `eager` indica que las imágenes se cargan
   * automáticamente cuando se consulta un producto.
   *
   * @type {ProductImage[]}
   */
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  image?: ProductImage[];

  /**
   * Colores disponibles para el producto.
   *
   * Almacena una lista de colores en formato de texto.
   *
   * @type {string[]}
   */
  @Column('text', {
    array: true,
  })
  color: string[];

  /**
   * Nombre único del producto.
   *
   * Este campo debe ser único en la base de datos.
   *
   * @type {string}
   */
  @Column('text', {
    unique: true,
  })
  name: string;

  /**
   * Descripción del producto.
   *
   * @type {string}
   */
  @Column('text')
  description: string;

  /**
   * Descuento aplicado al producto.
   *
   * @type {number}
   */
  @Column('float')
  discount: number;

  /**
   * Materiales del producto.
   *
   * Almacena una lista de materiales en formato de texto.
   *
   * @type {string[]}
   */
  @Column('text', {
    array: true,
  })
  material: string[];

  /**
   * Tamaños disponibles para el producto.
   *
   * Almacena una lista de tamaños en formato numérico.
   *
   * @type {number[]}
   */
  @Column('float', {
    array: true,
  })
  size: number[];

  /**
   * Cantidad de unidades en stock.
   *
   * @type {number}
   */
  @Column('int')
  stock: number;

  /**
   * Estado de disponibilidad del producto.
   *
   * Indica si el producto está activo y disponible para su compra. El valor por defecto es `true`.
   *
   * @type {boolean}
   */
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  /**
   * Fecha y hora en que se creó el producto.
   *
   * Esta columna se establece automáticamente cuando se crea el registro.
   *
   * @type {string}
   */
  @CreateDateColumn()
  createdAt: string;

  /**
   * Fecha y hora en que se actualizó por última vez el producto.
   *
   * Esta columna se actualiza automáticamente cada vez que se actualiza el registro.
   *
   * @type {string}
   */
  @UpdateDateColumn()
  updatedAt: string;
}
