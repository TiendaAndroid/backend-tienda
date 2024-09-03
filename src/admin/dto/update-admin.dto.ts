import { PartialType } from '@nestjs/mapped-types';
import { IsHexColor, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  logo: string;

  @IsOptional()
  @IsHexColor()
  primaryColor: string;

  @IsOptional()
  @IsHexColor()
  secondaryColor: string;

  @IsOptional()
  @IsHexColor()
  thirdColor: string;

  @IsOptional()
  @IsHexColor()
  primaryFontColor: string;

  @IsOptional()
  @IsHexColor()
  secondaryFontColor: string;

  @IsOptional()
  @IsHexColor()
  thirdFontColor: string;
}
