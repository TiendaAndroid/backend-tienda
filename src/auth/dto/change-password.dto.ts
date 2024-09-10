import { IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword()
  newPassword: string;

  @IsString()
  token: string;
}
