import { User } from 'src/auth/entities/user.entity';
import { ValidStatus } from '../interfaces/valid-status';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoVivienda } from 'src/directions/entities/tipo.enum';

export class CreateOrderDto {
  @IsUUID()
  user: User;

  @IsEnum(ValidStatus)
  @IsOptional()
  status: ValidStatus;

  @IsEnum(TipoVivienda)
  tipo: TipoVivienda;

  @IsString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  pais: string;

  @IsString()
  municipio: string;

  @IsString()
  estado: string;

  @IsString()
  calle: string;

  @IsString()
  noExterior: string;

  @IsString()
  @IsOptional()
  noInterior: string;

  @IsString()
  colonia: string;

  @IsNumber()
  cp: number;
}
