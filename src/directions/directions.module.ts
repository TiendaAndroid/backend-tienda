import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService],
  imports: [TypeOrmModule.forFeature([Direction]), AuthModule],
})
export class DirectionsModule {}
