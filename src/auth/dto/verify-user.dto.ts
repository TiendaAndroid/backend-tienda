import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword()
  password: string;
}
