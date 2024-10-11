import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItems } from './entities/cart-item.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from 'src/products/entities';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [TypeOrmModule.forFeature([Cart,CartItems,Product]), forwardRef(() => AuthModule)],
  exports: [CartService, TypeOrmModule, CartModule]
})
export class CartModule {}
