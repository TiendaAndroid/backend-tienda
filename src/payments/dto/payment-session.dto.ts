import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { TipoVivienda } from 'src/directions/entities/tipo.enum';

export class PaymentsSessionDto {
  @IsString()
  currency: string;

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
