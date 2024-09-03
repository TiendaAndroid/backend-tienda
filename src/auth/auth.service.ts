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
import { LoginUserDto, CreateUserDto, LoginGoogleDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

// Funciones de la autenticación del usuario
// Autor: Fidel Bonilla

@Injectable()
export class AuthService {
  // Constructor de la base de datos
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para crear un usuario, al registrar
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, ...userData } = createUserDto;
  
      // Verificar si el correo ya existe en la base de datos
      const existingUser = await this.userRepository.findOne({ where: { email } });
  
      if (existingUser) {
        // Verificar si el usuario tiene un googleId
        if (existingUser.googleId) {
          // Si tiene un googleId y no tiene contraseña, actualizar la contraseña
          if (!existingUser.password) {
            existingUser.password = bcrypt.hashSync(password, 10);
            await this.userRepository.save(existingUser);
            delete existingUser.password;
            return {
              ...existingUser,
              token: this.getJwtToken({ id: existingUser.id }),
            };
          } else {
            // Si tiene una contraseña, lanzar un error indicando que el usuario ya existe
            throw new BadRequestException("El correo ya esta registrado")
          }
        } else {
          // Si no tiene un googleId, lanzar un error indicando que el usuario ya existe
          throw new Error('El usuario ya existe.');
        }
      } else {
        // Si el correo no existe, crear el usuario normalmente
        const user = this.userRepository.create({
          ...userData,
          email,
          password: bcrypt.hashSync(password, 10),
        });
  
        // Guardar el usuario en la base de datos
        await this.userRepository.save(user);
  
        // Eliminar la contraseña del objeto de usuario
        delete user.password;
        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      }
    } catch (err) {
      // Manejo de errores
      throw err
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
    
    if(!user.password){
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

  async googleLogin(loginGoogle: LoginGoogleDto) {
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
    }
    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // Generar un token
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // Método para controlar los errores que aparecen en las pruebas
  private handleError(error: any): never {
    // Manejo del error si el usuario se registra 2 veces con el mismo correo
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    // Manejo del error si el servidor no puede procesar la solicitud
    console.log(error);
    throw new InternalServerErrorException('Server logs');
  }
}
