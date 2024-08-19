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
import { LoginUserDto, CreateUserDto } from './dto';
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
      // Encriptar la contraseña
      // Forma en la que se encripta contraseña por medio de un hash
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
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
    } catch (err) {
      // Manejo de errores
      this.handleError(err);
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

    // Verifica si la contraseña es correcta
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
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
