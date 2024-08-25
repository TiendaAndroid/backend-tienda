import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class DirectionsService {
  constructor(
    @InjectRepository(Direction)
    private readonly directionsRepository: Repository<Direction>,
  ) {}
  async create(createDirectionDto: CreateDirectionDto) {
    try {
      const direction = this.directionsRepository.create(createDirectionDto);
      await this.directionsRepository.save(direction);
      return direction;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async findOne(id: string): Promise<Direction> {
    let direction: Direction;
    if (isUUID(id)) {
      direction = await this.directionsRepository.findOne({
        where: { id },
      });
    }
    if (!direction) {
      throw new NotFoundException(
        `There are no results for the search. Search term: ${id}`,
      );
    }
    return direction;
  }

  async update(
    id: string,
    updateDirectionDto: UpdateDirectionDto,
  ): Promise<Direction> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }

    const direction = await this.directionsRepository.findOne({
      where: { id: id },
    });

    if (!direction) {
      throw new NotFoundException(
        'La dirección con el ID especificado no fue encontrada.',
      );
    }

    const updatedDirection = Object.assign(direction, updateDirectionDto);

    return await this.directionsRepository.save(updatedDirection);
  }

  async remove(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }

    const direction = await this.directionsRepository.findOne({
      where: { id: id },
    });

    if (!direction) {
      throw new NotFoundException(
        'La dirección con el ID especificado no fue encontrada.',
      );
    }

    await this.directionsRepository.remove(direction);
  }
}
