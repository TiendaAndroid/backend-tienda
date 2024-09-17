import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  LoginUserDto,
  CreateUserDto,
  LoginGoogleDto,
  ChangePasswordDto,
} from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { VerifyUser } from './entities/verify-user.entity';
import { ResetPassword } from './entities/reset-password.entity';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Cart } from 'src/cart/entities/cart.entity';
import { Response } from 'express';
import { envs } from 'src/config';

// Funciones de la autenticación del usuario
// Autor: Fidel Bonilla

@Injectable()
export class AuthService {
  // Constructor de la base de datos
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerifyUser)
    private readonly verifyUserRepository: Repository<VerifyUser>,
    @InjectRepository(ResetPassword)
    private readonly resetPassRepository: Repository<ResetPassword>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async mail(verifyUserDto: VerifyUserDto) {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    verifyUserDto.token = token;
    try {
      let showUser = await this.userRepository.findOne({
        where: { email: verifyUserDto.email },
      });
      if (showUser) {
        throw new BadRequestException('El correo ya esta registrado');
      }

      let user = await this.verifyUserRepository.findOne({
        where: { email: verifyUserDto.email },
      });

      if (!user) {
        user = this.verifyUserRepository.create(verifyUserDto);
        await this.verifyUserRepository.save(user);
      }

      await this.mailService.sendUserConfirmation(user);
      return ['Mail sended'];
    } catch (error) {
      throw error;
    }
  }

  async mailResetPassword(resetPasswordDto: ResetPasswordDto) {
    const token = uuidv4();
    try {
      let showUser = await this.userRepository.findOne({
        where: { email: resetPasswordDto.email },
      });
      if (!showUser) {
        throw new BadRequestException('El correo no esta registrado');
      }

      // Buscar al usuario por su email
      let user = await this.resetPassRepository.findOne({
        where: { email: resetPasswordDto.email },
      });

      if (!user) {
        const userCreate = this.resetPassRepository.create({
          email: resetPasswordDto.email,
          token: token,
          dateValid: new Date(Date.now() + 15 * 60 * 1000),
        });
        await this.resetPassRepository.save(userCreate);
        await this.mailService.sendUserResetPassword(userCreate);
        return ['Mail sended'];
      } else {
        user.token = token;
        user.dateValid = new Date(Date.now() + 15 * 60 * 1000);
        await this.resetPassRepository.save(user);
        await this.mailService.sendUserResetPassword(user);
        return ['Mail sended'];
      }
    } catch (error) {
      throw error;
    }
  }

  async getResetPass(token: string) {
    try {
      const user = await this.resetPassRepository.findOne({ where: { token } });

      if (!user || (user.dateValid && new Date(user.dateValid) < new Date())) {
        throw new BadRequestException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });

      // Si el usuario no existe, lanzar un error
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      delete user.password;

      return user;
    } catch (error) {
      // Manejar errores utilizando el método handleError
      this.handleError(error);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    try {
      const passUser = await this.resetPassRepository.findOne({
        where: { token: changePasswordDto.token },
      });

      if (
        !passUser ||
        (passUser.dateValid && new Date(passUser.dateValid) < new Date())
      ) {
        throw new BadRequestException('Usuario no encontrado');
      }

      await this.resetPassRepository.delete(passUser);

      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({
        where: { email: passUser.email },
      });

      const password = bcrypt.hashSync(changePasswordDto.newPassword, 10);

      user.password = password;

      await this.userRepository.save(user);

      delete user.password;

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Método para crear un usuario, al registrar
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, token, ...userData } = createUserDto;

      // Verificar si el correo ya existe en la base de datos
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        // Verificar si el usuario tiene un googleId
        if (existingUser.googleId) {
          // Si tiene un googleId y no tiene contraseña, actualizar la contraseña
          if (!existingUser.password) {
            let userEmail = await this.verifyUserRepository.findOne({
              where: { email: createUserDto.email },
            });
            const tokenGive = userEmail.token;
            if (tokenGive !== token) {
              existingUser.password = bcrypt.hashSync(password, 10);
              await this.userRepository.save(existingUser);
              delete existingUser.password;
              await this.verifyUserRepository.delete(userEmail);
              return {
                ...existingUser,
                token: this.getJwtToken({ id: existingUser.id }),
              };
            }
          } else {
            // Si tiene una contraseña, lanzar un error indicando que el usuario ya existe
            throw new BadRequestException('El correo ya esta registrado');
          }
        } else {
          // Si no tiene un googleId, lanzar un error indicando que el usuario ya existe
          throw new Error('El usuario ya existe.');
        }
      } else {
        // Si el correo no existe, crear el usuario normalmente
        let userEmail = await this.verifyUserRepository.findOne({
          where: { email: createUserDto.email },
        });
        const tokenGive = userEmail.token;
        if (tokenGive !== token) {
          throw new BadRequestException('El token no es valido');
        } else {
          const user = this.userRepository.create({
            ...userData,
            email,
            password: bcrypt.hashSync(password, 10),
          });

          await this.verifyUserRepository.delete(userEmail);

          // Guardar el usuario en la base de datos
          await this.userRepository.save(user);

          const cart = this.cartRepository.create({ user });
          await this.cartRepository.save(cart);

          // Eliminar la contraseña del objeto de usuario
          delete user.password;
          return {
            ...user,
            token: this.getJwtToken({ id: user.id }),
          };
        }
      }
    } catch (err) {
      // Manejo de errores
      throw err;
    }
  }

  // Método para que inicie sesión el usuario
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Buscar al usuario por su correo
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    // Busca si el correo esta registrado
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!user.password) {
      throw new UnauthorizedException('Usuario registrado solo con google');
    }

    // Verifica si la contraseña es correcta
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async googleLogin(loginGoogle: LoginGoogleDto,  res: Response) {
    const { email, googleId, name, lastName } = loginGoogle;
    let user = await this.userRepository.findOne({
      where: [{ email }, { googleId }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await this.userRepository.save(user);
      }
    } else {
      // Crear un nuevo usuario si no existe
      user = this.userRepository.create({
        email: email,
        googleId: googleId,
        name: name,
        lastName: lastName,
      });
      await this.userRepository.save(user);
      const cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    delete user.password;

    const token = this.getJwtToken({ id: user.id })

    return res.redirect(`${envs.url_frontend}/login/${token}`);
  }

  // Generar un token
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll() {
    try {
      // Obtener todos los usuarios de la base de datos
      const users = await this.userRepository.find();

      // Excluir la contraseña de cada usuario
      return users.map((user) => {
        delete user.password;
        return user;
      });
    } catch (error) {
      // Manejar errores utilizando el método handleError
      this.handleError(error);
    }
  }

  async changeUserRoleToAdmin(userId: string): Promise<User> {
    try {
      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });

      // Si el usuario no existe, lanzar un error
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Cambiar el rol del usuario a administrador
      user.role = ['user', 'admin'];

      // Guardar los cambios en la base de datos
      await this.userRepository.save(user);

      // Eliminar la contraseña del objeto de usuario antes de devolverlo
      delete user.password;

      return user;
    } catch (error) {
      // Manejar errores utilizando el método handleError
      this.handleError(error);
    }
  }

  async changeUserRoleToUser(userId: string): Promise<User> {
    try {
      // Buscar al usuario por su ID
      const user = await this.userRepository.findOne({ where: { id: userId } });

      // Si el usuario no existe, lanzar un error
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Cambiar el rol del usuario a administrador
      user.role = ['user'];

      // Guardar los cambios en la base de datos
      await this.userRepository.save(user);

      // Eliminar la contraseña del objeto de usuario antes de devolverlo
      delete user.password;

      return user;
    } catch (error) {
      // Manejar errores utilizando el método handleError
      this.handleError(error);
    }
  }

  // Método para controlar los errores que aparecen en las pruebas
  private handleError(error: any): never {
    // Manejo del error si el usuario se registra 2 veces con el mismo correo
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Server logs');
  }
}
