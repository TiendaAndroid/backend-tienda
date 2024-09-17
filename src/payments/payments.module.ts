import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { Order, OrderItems } from 'src/orders/entities';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Order, OrderItems]),
    OrdersModule,
  ],
})
export class PaymentsModule {}
