import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { VerifyUserDto } from 'src/auth/dto/verify-user.dto';
import { ResetPassword } from 'src/auth/entities/reset-password.entity';
import { User } from 'src/auth/entities/user.entity';
import { envs } from 'src/config';

interface OrderDetails {
  customerName: string;
  orderNumber: string;
  paymentDate: string;
  totalAmount: string;
  products: { name: string; quantity: number; price: string }[];
}

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
        token:
          `${envs.url_frontend}/restablecer-contrasena/` + resetPassword.token,
      },
    });
  }

  async sendUserSendConfirmation(orderId: string, name: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmación de envío de Zazil',
      template: 'send',
      context: {
        name: name,
        orderId: orderId,
      },
    });
  }

  async sendOrderConfirmation(email: string, orderDetails: OrderDetails) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmación de Pedido',
      template: 'order',
      context: {
        customerName: orderDetails.customerName,
        orderNumber: orderDetails.orderNumber,
        paymentDate: orderDetails.paymentDate,
        totalAmount: orderDetails.totalAmount,
        products: orderDetails.products,
      },
    });
  }
}
