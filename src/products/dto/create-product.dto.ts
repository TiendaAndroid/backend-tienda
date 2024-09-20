import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) para crear un nuevo producto.
 *
 * Este DTO define las propiedades requeridas y opcionales para la creación de un producto,
 * así como las validaciones necesarias para garantizar que los datos sean válidos y coherentes.
 *
 * @author Fidel Bonilla
 */
export class CreateProductDto {
  /**
   * Precio del producto.
   *
   * Debe ser un número.
   *
   * @type {number}
   */
  @IsNumber()
  price: number;

  /**
   * Lista de URLs de imágenes asociadas al producto.
   *
   * Debe ser un arreglo de cadenas de texto. Esta propiedad es opcional.
   *
   * @type {string[]}
   */
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  image: string[];

  /**
   * Colores disponibles para el producto.
   *
   * Debe ser un arreglo de cadenas de texto.
   *
   * @type {string[]}
   */
  @IsString({ each: true })
  @IsArray()
  color: string[];

  /**
   * Nombre del producto.
   *
   * Debe ser una cadena de texto con una longitud mínima de 1 carácter y máxima de 50 caracteres.
   *
   * @type {string}
   */
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  /**
   * Descripción del producto.
   *
   * Debe ser una cadena de texto con una longitud mínima de 1 carácter.
   *
   * @type {string}
   */
  @IsString()
  @MinLength(1)
  description: string;

  /**
   * Descuento aplicado al producto.
   *
   * Debe ser un número. Esta propiedad es opcional.
   *
   * @type {number}
   */
  @IsNumber()
  @IsOptional()
  discount: number;

  /**
   * Materiales del producto.
   *
   * Debe ser un arreglo de cadenas de texto.
   *
   * @type {string[]}
   */
  @IsString({ each: true })
  @IsArray()
  type: string[];

  /**
   * Cantidad de unidades en stock.
   *
   * Debe ser un número.
   *
   * @type {number}
   */
  @IsNumber()
  stock: number;

  /**
   * Estado de disponibilidad del producto.
   *
   * Indica si el producto está activo y disponible para la venta. Esta propiedad es opcional
   * y el valor predeterminado es `true`.
   *
   * @type {boolean}
   */
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
