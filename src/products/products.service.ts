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
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PostgreSQLErrorCodes } from 'src/common/enums/db-error.code.enum';
import { isUUID } from 'class-validator';
import { Product, ProductImage } from './entities';

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

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const { 0: data, 1: totalResults } =
      await this.productRepository.findAndCount({
        where: {
          isActive: true,
        },
        take: limit,
        skip: offset,
        relations: {
          image: true,
        },
      });
    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);
    return { limit, offset, partialResults: data.length, totalResults, data };
  }

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

  async findOnePlain(term: string) {
    const { image = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: image.map((image) => image.url),
    };
  }

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

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isActive = false;
    await this.productRepository.save(product);

    return product;
  }

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
