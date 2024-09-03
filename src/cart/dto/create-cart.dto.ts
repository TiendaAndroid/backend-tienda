import { IsString, IsUUID } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateCartDto {
  @IsUUID()
  user: User;
  // otros campos del carrito
}
