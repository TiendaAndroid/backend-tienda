import { Product } from 'src/products/entities';
import { Cart } from '../entities/cart.entity';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  cart: Cart;

  @IsUUID()
  product: Product;

  @IsNumber()
  quantity: number;
}
