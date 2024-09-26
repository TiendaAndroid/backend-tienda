import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { DirectionsModule } from './directions/directions.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    // Método en la que controlamos la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db_host,
      port: Number(envs.db_port),
      database: envs.db_name,
      username: envs.db_user,
      password: envs.db_password,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProductsModule,
    FilesModule,
    DirectionsModule,
    OrdersModule,
    CartModule,
    AdminModule,
    MailModule,
    PaymentsModule,    
  ],
})
export class AppModule {}
