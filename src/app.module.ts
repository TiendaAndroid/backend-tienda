import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';

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
  ],
})
export class AppModule {}
