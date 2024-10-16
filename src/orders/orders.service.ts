import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, CreateOrderItemsDto, UpdateOrderDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Order, OrderItems } from './entities';
import { isUUID } from 'class-validator';
import { FindOperator } from 'typeorm';
import { ValidStatus } from './interfaces/valid-status';
import * as moment from 'moment-timezone';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, totalResults] = await this.ordersRepository.findAndCount({
      take: limit,
      skip: offset * limit,
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });

    if (!data.length || totalResults == 0)
      throw new NotFoundException(`There aren't results for the search`);

    const mappedData = data.map((order) => ({
      ...order,
      user: {
        email: order.user.email,
      },
    }));

    return {
      limit,
      offset,
      partialResults: data.length,
      totalResults,
      data: mappedData,
    };
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
        relations: ['user'],
      });
    }
    if (!order) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }
    delete order.user.password
    return order;
  }

  async sales() {
    const [data] = await this.ordersRepository.findAndCount({
      where: {
        status: 'PAID' as ValidStatus | FindOperator<ValidStatus>,
      },
    });

    const totalSales = data.reduce(
      (sum, order) =>
        sum +
        order.order_items.reduce(
          (subSum, item) => subSum + item.quantity * item.product.price,
          0,
        ),
      0,
    );

    const productsSales = data.reduce(
      (sum, order) =>
        sum +
        order.order_items.reduce((subSum, item) => subSum + item.quantity, 0),
      0,
    );

    return { totalSales, productsSales };
  }

  async weeklySales(): Promise<number[]> {
    const weeklySales: number[] = [];
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

    const startOfWeek = moment()
      .tz('America/Mexico_City')
      .startOf('week')
      .format('YYYY-MM-DD HH:mm:ss');
    const endOfWeek = moment()
      .tz('America/Mexico_City')
      .endOf('week')
      .format('YYYY-MM-DD HH:mm:ss');

    for (const day of daysOfWeek) {
      const [data] = await this.ordersRepository.findAndCount({
        where: {
          status: 'PAID' as ValidStatus | FindOperator<ValidStatus>,
          createdAt: Raw((alias) => {
            return `${alias} >= '${startOfWeek}' AND ${alias} <= '${endOfWeek}' AND EXTRACT(DOW FROM ${alias} AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = ${day}`;
          }),
        },
      });

      const totalSales = data.reduce(
        (sum, order) =>
          sum +
          order.order_items.reduce((subSum, item) => subSum + item.quantity, 0),
        0,
      );

      weeklySales.push(totalSales);
    }

    return weeklySales;
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
