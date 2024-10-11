import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartItems } from './entities/cart-item.entity';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItems)
    private readonly cartItemRepository: Repository<CartItems>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const cart = this.cartRepository.create(createCartDto);
      await this.cartRepository.save(cart);
      return cart;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async findOne(userId: string): Promise<Cart> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      return user.cart;
    } catch (err) {
      throw new BadRequestException(err.detail);
    }
  }

  async findOneUser(id: string): Promise<Cart> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const cart = await this.cartRepository.findOne({
      where: { user: { id: id } },
      relations: ['user', 'cart_items'],
    });

    delete cart.user;

    if (!cart) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }

    return cart;
  }

  async cartItemsCreate(createCartItemDto: CreateCartItemDto) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: createCartItemDto.product,
        },
      });

      if (!product) {
        throw new BadRequestException('Producto no encontrado');
      }

      if (product.stock > 0) {
        const cart = await this.cartRepository.findOne({
          where: {
            id: createCartItemDto.cart,
          },
        });

        if (!cart) {
          throw new BadRequestException('Carrito no encontrado');
        }

        const cartItem = this.cartItemRepository.create({
          cart,
          product,
          quantity: createCartItemDto.quantity,
        });

        await this.cartItemRepository.save(cartItem);
        return cartItem;
      } else {
        throw new BadRequestException(
          'No hay stock disponible para este producto',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al crear el ítem del carrito',
      );
    }
  }

  async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id,
      },
      relations: ['product'], 
    });

    if (!cartItem) {
      throw new NotFoundException(
        `El ítem del carrito con ID ${id} no se encontró`,
      );
    }
    const newQuantity = updateCartItemDto.quantity;
    if (newQuantity > cartItem.product.stock) {
      throw new BadRequestException(
        `No se puede actualizar. La cantidad solicitada (${newQuantity}) excede el stock disponible (${cartItem.product.stock})`,
      );
    }

    await this.cartItemRepository.update(id, updateCartItemDto);

    return {
      ...cartItem,
      ...updateCartItemDto, 
    };
  }

  async removeCartItem(id: string): Promise<CartItems> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await this.cartItemRepository.remove(cartItem);
    return cartItem;
  }

  async remove(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cart_items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    await this.cartItemRepository.remove(cart.cart_items);
    return cart;
  }
}
