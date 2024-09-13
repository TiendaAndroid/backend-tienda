import { User } from 'src/auth/entities/user.entity';
import { TipoVivienda } from '../entities/tipo.enum';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDirectionDto {
  @IsEnum(TipoVivienda)
  tipo: TipoVivienda;

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
