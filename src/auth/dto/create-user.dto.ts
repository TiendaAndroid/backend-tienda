import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo usuario.
 *
 * Este DTO contiene las propiedades necesarias para crear un nuevo usuario en la aplicación.
 * Se utiliza para validar los datos de entrada y asegurar que los datos son correctos antes de ser procesados.
 *
 * @export
 * @class CreateUserDto
 * @author Fidel Bonilla
 */
export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  token: string;

  @IsString()
  birthDay: string;

  @IsString()
  phoneNumber: string;
}
