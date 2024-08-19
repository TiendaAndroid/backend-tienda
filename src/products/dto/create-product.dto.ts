import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  image: string[];

  @IsString({ each: true })
  @IsArray()
  color: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString({ each: true })
  @IsArray()
  material: string[];

  @IsNumber({}, { each: true })
  @IsArray()
  size: number[];

  @IsNumber()
  stock: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
