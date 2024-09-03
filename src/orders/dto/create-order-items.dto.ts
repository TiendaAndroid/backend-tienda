import { IsNumber, IsUUID } from 'class-validator';
import { Order } from '../entities';
import { Product } from 'src/products/entities';

export class CreateOrderItemsDto {
  @IsUUID()
  order: Order;

  @IsUUID()
  product: Product;

  @IsNumber()
  quantity: number;
}
