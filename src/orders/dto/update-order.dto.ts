import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ValidStatus } from '../interfaces/valid-status';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(ValidStatus)
  status: ValidStatus;
}
