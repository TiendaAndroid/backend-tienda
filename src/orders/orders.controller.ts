import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemsDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('item')
  createOrderItem(@Body() CreateOrderItemsDto: CreateOrderItemsDto) {
    return this.ordersService.createOrderItem(CreateOrderItemsDto);
  }
  
  @Get('total')
  sales() {
    return this.ordersService.sales();
  }

  @Get()
  findAllOrders(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @Get('weekly-sales')
  findAll() {
    return this.ordersService.weeklySales();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
