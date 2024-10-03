import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { envs } from 'src/config';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-payment-session')
  @UseGuards(JwtAuthGuard)
  createPaymentSession(@Req() req,@Body() paymentsSessionDto: PaymentsSessionDto) {
    return this.paymentsService.createPaymentSession(req.user.id, paymentsSessionDto);
  }

  @Post('create-payment-session-android')
  @UseGuards(JwtAuthGuard)
  createPaymentIntent(@Req() req,@Body() paymentsSessionDto: PaymentsSessionDto) {
    return this.paymentsService.createPaymentIntent(req.user.id, paymentsSessionDto);
  }

  @Get('success')
  success(@Res() res: Response) {
    return res.redirect(`${envs.url_frontend}/carrito/pagado`);
  }

  @Get('cancel')
  cancel(@Res() res: Response) {
    return res.redirect(`${envs.url_frontend}`);
  }

  @Post('webhook')
  webhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.webhook(req, res);
  }

  
}
