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
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class DirectionsService {
  constructor(
    @InjectRepository(Direction)
    private readonly directionsRepository: Repository<Direction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(userId: string, createDirectionDto: CreateDirectionDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      const direction = this.directionsRepository.create({
        ...createDirectionDto,
        user: user,
      });
      const savedDirection = await this.directionsRepository.save(direction);
      return savedDirection;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async findOne(userId: string): Promise<Direction> {
    try {
      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      return user.direction;
    } catch (error) {
      // Manejar errores utilizando el método handleError
      throw error;
    }
  }

  async update(
    userId: string,
    id: string,
    updateDirectionDto: UpdateDirectionDto,
  ): Promise<Direction> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }

    const direction = await this.directionsRepository.findOne({
      where: { id: id, user: user },
    });

    if (!direction) {
      throw new NotFoundException(
        'La dirección con el ID especificado no fue encontrada.',
      );
    }

    const updatedDirection = Object.assign(direction, updateDirectionDto);

    return await this.directionsRepository.save(updatedDirection);
  }

  async findOneDirection(userId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }

    const direction = await this.directionsRepository.findOne({
      where: { id: id, user: { id: userId } },
    });

    if (!direction) {
      throw new NotFoundException(
        'La dirección con el ID especificado no fue encontrada.',
      );
    }

    return direction;
  }

  async remove(userId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!isUUID(id)) {
      throw new BadRequestException(
        'El ID proporcionado no es un UUID válido.',
      );
    }

    const direction = await this.directionsRepository.findOne({
      where: { id: id, user: { id: userId } },
    });

    if (!direction) {
      throw new NotFoundException(
        'La dirección con el ID especificado no fue encontrada.',
      );
    }

    await this.directionsRepository.remove(direction);

    return {
      message: 'Dirección eliminada',
    };
  }
}
