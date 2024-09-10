import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { VerifyUserDto } from 'src/auth/dto/verify-user.dto';
import { ResetPassword } from 'src/auth/entities/reset-password.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: VerifyUserDto) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Código de verificación Zazil',
      template: 'welcome',
      context: {
        name: user.name + ' ' + user.lastName,
        token: user.token,
      },
    });
  }

  async sendUserResetPassword(resetPassword: ResetPassword) {
     await this.mailerService.sendMail({
       to: resetPassword.email,
       subject: 'Restablecer contraseña de Zazil',
       template: 'reset',
       context: {
         token: 'http://localhost:3002/restablecer-contrasena/'+resetPassword.token,
       },
     });
   }
}
