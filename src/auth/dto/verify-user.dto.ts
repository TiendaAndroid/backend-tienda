import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword()
  password: string;
}
