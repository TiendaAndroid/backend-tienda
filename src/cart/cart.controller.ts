import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req) {
    return this.cartService.findOne(req.user.id);
  }

  @Get('user/:id')
  findOneUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartService.findOneUser(id);
  }

  @Post('item')
  addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.cartItemsCreate(createCartItemDto);
  }

  @Patch('item/:id')
  updateItem(
    @Param('id') id: string,
    @Body() UpdateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, UpdateCartItemDto);
  }

  @Delete('item/:id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
