import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';

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
  ],
})
export class AppModule {}
