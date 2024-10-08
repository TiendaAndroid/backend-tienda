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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItems)
    private readonly cartItemRepository: Repository<CartItems>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    } catch(err) {
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
      const cart = this.cartItemRepository.create(createCartItemDto);
      await this.cartItemRepository.save(cart);
      return cart;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await this.cartItemRepository.update(id, updateCartItemDto);
    return cartItem;
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
