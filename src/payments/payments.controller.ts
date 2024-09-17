import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-payment-session')
  @UseGuards(JwtAuthGuard)
  createPaymentSession(@Req() req,@Body() paymentsSessionDto: PaymentsSessionDto) {
    return this.paymentsService.createPaymentSession(req.user.id, paymentsSessionDto);
  }

  @Get('success')
  success(@Res() res: Response) {
    return res.redirect('http://localhost:3001/carrito/pagado');
  }

  @Get('cancel')
  cancel(@Res() res: Response) {
    return res.redirect('http://localhost:3001');
  }

  @Post('webhook')
  webhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.webhook(req, res);
  }
}
