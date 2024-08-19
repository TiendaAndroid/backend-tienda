import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
import { ValidRoles } from './interface';

// Este controlador es responsable de manejar las solicitudes de los usuarios
// Autor: Fidel Bonilla

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  privateRoute(
    @GetUser() user: User,

    // Se da el objeto que se quiere recibir del usuario
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string,
  ) {
    return {
      ok: true,
      message: 'You have access to this route',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private-roles')
  @Auth(ValidRoles.superUser, ValidRoles.user)
  privateRouteRoles(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
