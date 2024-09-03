import { User } from 'src/auth/entities/user.entity';
import { ValidStatus } from '../interfaces/valid-status';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  user: User;

  @IsNumber()
  totalAmount: number;

  @IsEnum(ValidStatus)
  @IsOptional()
  status: ValidStatus;
}
