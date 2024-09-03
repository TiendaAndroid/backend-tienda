import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, CreateOrderItemsDto, UpdateOrderDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItems } from './entities';
import { isUUID } from 'class-validator';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItems)
    readonly orderItemRepository: Repository<OrderItems>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const cart = this.ordersRepository.create(createOrderDto);
      await this.ordersRepository.save(cart);
      return cart;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async createOrderItem(createOrderItemDto: CreateOrderItemsDto) {
    try {
      const cart = this.orderItemRepository.create(createOrderItemDto);
      await this.orderItemRepository.save(cart);
      return cart;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async findOne(id: string): Promise<Order> {
    let order: Order;
    if (isUUID(id)) {
      order = await this.ordersRepository.findOne({
        where: { id },
      });
    }
    if (!order) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(
        'La orden con el ID especificado no fue encontrada.',
      );
    }

    const updateOrder = Object.assign(order, updateOrderDto);

    return await this.ordersRepository.save(updateOrder);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
