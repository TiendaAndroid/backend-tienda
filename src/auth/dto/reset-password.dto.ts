import { IsDate, IsDateString, IsEmail, IsString } from "class-validator";

export class ResetPasswordDto {
     @IsString()
     @IsEmail()
     email: string;
   }
   