import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Raw, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PostgreSQLErrorCodes } from 'src/common/enums/db-error.code.enum';
import { isUUID } from 'class-validator';
import { Product, ProductImage } from './entities';

/**
 * Servicio para gestionar productos en la aplicación.
 *
 * Este servicio proporciona métodos para crear, buscar, actualizar y eliminar productos.
 * Además, maneja la lógica de persistencia en la base de datos y el manejo de errores.
 *
 * @author Fidel Bonilla
 */
@Injectable()
export class ProductsService {
  private readonly _logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea un nuevo producto en la base de datos.
   *
   * Este método recibe los detalles del producto, incluyendo las imágenes, y guarda el producto en la base de datos.
   *
   * @param createProductDto - Los detalles del producto a crear.
   *
   * @returns El producto creado con las imágenes asociadas.
   *
   * @throws {BadRequestException} Si ocurre un error durante la operación de base de datos.
   *
   * @author Fidel Bonilla
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const { image = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        image: image.map((url) => this.productImageRepository.create({ url })),
      });
      await this.productRepository.save(product);
      return { ...product, image };
    } catch (error) {
      this._handleDBException(error);
    }
  }

  /**
   * Encuentra todos los productos con paginación.
   *
   * Este método devuelve una lista de productos activos con soporte para paginación.
   *
   * @param paginationDto - Detalles de la paginación (límites y desplazamiento).
   *
   * @returns Un objeto que contiene los productos, el total de resultados y detalles de paginación.
   *
   * @throws {NotFoundException} Si no se encuentran productos.
   *
   * @author Fidel Bonilla
   */
  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.productRepository.findAndCount({
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset * limit,
      relations: {
        image: true,
      },
    });
    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);
    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  /**
   * Busca productos por nombre con paginación.
   *
   * Este método devuelve una lista de productos activos que coinciden con el nombre proporcionado, con soporte para paginación.
   *
   * @param name - El nombre de los productos que quieres buscar.
   * @param paginationDto - Detalles de la paginación (límites y desplazamiento).
   *
   * @returns Un objeto que contiene los productos, el total de resultados y detalles de paginación.
   *
   * @throws {NotFoundException} Si no se encuentran productos.
   *
   * @author Fidel Bonilla
   */
  async findByName(name: string) {
    const [data, totalResults] = await this.productRepository.findAndCount({
      where: {
        isActive: true,
        name: Raw((alias) => `${alias} ILIKE '%${name}%'`), // Usa ILIKE para una búsqueda de texto insensible a mayúsculas y minúsculas
      },
      relations: {
        image: true,
      },
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`There aren't results for the search`);
    }

    return { data };
  }

  /**
   * Encuentra todos los productos con un color específico con paginación.
   *
   * Este método devuelve una lista de productos activos y con el color indicado con soporte para paginación.
   *
   * @param color - Color de los productos que quieres mostrar.
   *
   * @param paginationDto - Detalles de la paginación (límites y desplazamiento).
   *
   * @returns Un objeto que contiene los productos, el total de resultados y detalles de paginación.
   *
   * @throws {NotFoundException} Si no se encuentran productos.
   *
   * @author Fidel Bonilla
   */
  async findColor(color: string, { limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.productRepository.findAndCount({
      where: {
        isActive: true,
        color: Raw((alias) => `${alias} @> ARRAY['${color}']::text[]`), // Usa la función ANY de PostgreSQL
      },
      relations: {
        image: true,
      },
      take: limit,
      skip: offset * limit,
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`There aren't results for the search`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  async findTipo(tipo: string, { limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.productRepository.findAndCount({
      where: {
        isActive: true,
        type: Raw((alias) => `${alias} @> ARRAY['${tipo}']::text[]`), // Usa el operador <@ de PostgreSQL
      },
      relations: {
        image: true,
      },
      take: limit,
      skip: offset * limit,
    });

    if (!data.length || totalResults === 0) {
      throw new NotFoundException(`There aren't results for the search`);
    }

    return { limit, offset, partialResults: data.length, totalResults, data };
  }

  /**
   * Encuentra un producto por su ID.
   *
   * Este método busca un producto por su ID. Solo se consideran IDs válidos en formato UUID.
   *
   * @param id - El ID del producto a buscar.
   *
   * @returns El producto encontrado.
   *
   * @throws {NotFoundException} Si no se encuentra el producto con el ID especificado.
   *
   * @author Fidel Bonilla
   */
  async findOne(id: string) {
    let product: Product;
    if (isUUID(id)) {
      product = await this.productRepository.findOneBy({ id: id });
    }
    if (!product)
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );

    return product;
  }

  /**
   * Encuentra un producto y devuelve su representación en formato simple.
   *
   * Este método busca un producto y devuelve sus detalles junto con las URLs de las imágenes.
   *
   * @param term - El ID o término de búsqueda del producto.
   *
   * @returns Un objeto con los detalles del producto y sus imágenes.
   *
   * @author Fidel Bonilla
   */
  async findOnePlain(term: string) {
    const { image = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: image.map((image) => image.url),
    };
  }

  /**
   * Actualiza un producto existente.
   *
   * Este método actualiza un producto con los detalles proporcionados. Si se incluyen imágenes, las imágenes existentes se eliminan y se guardan las nuevas imágenes.
   *
   * @param id - El ID del producto a actualizar.
   * @param updateProductDto - Los detalles del producto a actualizar.
   *
   * @returns El producto actualizado.
   *
   * @throws {NotFoundException} Si no se encuentra el producto con el ID especificado.
   * @throws {BadRequestException} Si ocurre un error durante la operación de base de datos.
   *
   * @author Fidel Bonilla
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { image, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id '${id}' not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (image) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.image = image.map((url) =>
          this.productImageRepository.create({ url }),
        );
        await queryRunner.manager.save(product);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return this.findOnePlain(id);
      }
      return await this.productRepository.save(product);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this._handleDBException(error);
    }
  }

  /**
   * Elimina un producto al marcarlo como inactivo.
   *
   * Este método marca un producto como inactivo en lugar de eliminarlo físicamente de la base de datos.
   *
   * @param id - El ID del producto a eliminar.
   *
   * @returns El producto marcado como inactivo.
   *
   * @throws {NotFoundException} Si no se encuentra el producto con el ID especificado.
   *
   * @author Fidel Bonilla
   */
  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isActive = false;
    await this.productRepository.save(product);

    return product;
  }

  /**
   * Maneja las excepciones relacionadas con la base de datos.
   *
   * Este método analiza el error recibido y lanza una excepción adecuada en función del código de error de PostgreSQL.
   *
   * @param error - El error de la base de datos que se está manejando.
   *
   * @throws {BadRequestException} Si el error es por violación de restricciones NOT NULL o UNIQUE.
   * @throws {InternalServerErrorException} Para errores inesperados.
   *
   * @author Fidel Bonilla
   */
  private _handleDBException(error: any) {
    if (error.code === PostgreSQLErrorCodes.NOT_NULL_VIOLATION)
      throw new BadRequestException(error.detail);

    if (error.code === PostgreSQLErrorCodes.UNIQUE_VIOLATION)
      throw new BadRequestException(error.detail);

    this._logger.error(error);
    console.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
