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
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto, LoginGoogleDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
import { ValidRoles } from './interface';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';

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
  @Auth(ValidRoles.admin)
  privateRouteRoles(@GetUser() user: User) {
    return this.authService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('email')
  send(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.mail(verifyUserDto);
  }

  @Post('email/reset')
  sendReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.mailResetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Patch('createAdmin/:id')
  @Auth(ValidRoles.admin)
  changeRoleAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.changeUserRoleToAdmin(id);
  }

  @Patch('createUser/:id')
  @Auth(ValidRoles.admin)
  changeRoleUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.changeUserRoleToUser(id);
  }

  @Patch('change/password')
  changePasswordUser(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto)
  }


  @Get('change/password/:id')
  changePassword(@Param('id') id: string) {
    return this.authService.getResetPass(id);
  }

  // Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    const { email, firstName: name, lastName: lastName, googleId } = req.user;

    const loginGoogleDto: LoginGoogleDto = {
      email,
      name,
      lastName,
      googleId,
    };

    return this.authService.googleLogin(loginGoogleDto, res);
  }
}
