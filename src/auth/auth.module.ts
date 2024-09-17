import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { VerifyUser } from './entities/verify-user.entity';
import { MailService } from 'src/mail/mail.service';
import { ResetPassword } from './entities/reset-password.entity';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/cart.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy,GoogleAuthGuard, MailService, CartService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, VerifyUser, ResetPassword]),

    // Json Web Token para el registro
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: envs.jwt_secret,
          signOptions: {
            expiresIn: '30d',
          },
        };
      },
    }),
    forwardRef(() => CartModule)
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
