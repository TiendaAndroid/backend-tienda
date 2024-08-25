import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService],
  imports: [TypeOrmModule.forFeature([Direction])],
})
export class DirectionsModule {}
