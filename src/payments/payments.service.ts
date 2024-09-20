import { BadRequestException, Injectable, Req } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from 'src/config';
import { PaymentsSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItems } from 'src/orders/entities';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { Product } from 'src/products/entities';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order) readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItems)
    readonly orderItemRepository: Repository<OrderItems>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productoRepository: Repository<Product>,
    private readonly mailService: MailService,
  ) {}
  private readonly stripe = new Stripe(envs.stripe_secret);

  async createPaymentSession(
    userId: string,
    paymentsSessionDto: PaymentsSessionDto,
  ) {
    try {
      const { currency, ...payment } = paymentsSessionDto;

      console.log(payment);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const order = this.ordersRepository.create({ user: user, ...payment });
      await this.ordersRepository.save(order);

      user.cart.cart_items.map((item) => {
        const orderItem = this.orderItemRepository.create({
          order: order,
          product: item.product,
          quantity: item.quantity,
        });
        this.orderItemRepository.save(orderItem);
      });

      const lineItems = user.cart.cart_items.map((item) => {
        return {
          price_data: {
            currency: currency,
            product_data: {
              name: item.product.name.toString(),
            },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_intent_data: {
          metadata: { order: order.id, email: user.email, name: user.name }, // Correct JSON format
        },
        line_items: lineItems,
        mode: 'payment',
        success_url: envs.stripe_success_url,
        cancel_url: envs.stripe_cancell_url,
      });

      return session;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create payment session',
      );
    }
  }

  async webhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    const endpointSecret = envs.stripe_endpoint_secret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceded = event.data.object;

        const order = await this.ordersRepository.findOne({
          where: { id: chargeSucceded.metadata.order },
        });

        if (order.status === 'PAID') {
          res.status(200).send('Order already processed');
          return;
        }

        const updateProduct = await this.productoRepository.findOne({
          where: { id: chargeSucceded.metadata.product },
        });

        if (updateProduct.stock > 0) {
          updateProduct.stock -= 1;
          await this.productoRepository.save(updateProduct);
        } else {
          throw new BadRequestException('Product out of stock');
        }

        const updateOrder = Object.assign(order, {
          status: 'PAID',
          paymentId: chargeSucceded.id,
          receiptUrl: chargeSucceded.receipt_url,
        });

        const savedOrder = await this.ordersRepository.save(updateOrder);
        let totalAmount = 0;
        order.order_items.forEach((item) => {
          const itemTotal = item.product.price * item.quantity;
          totalAmount += itemTotal;
        });

        await this.mailService.sendOrderConfirmation(
          chargeSucceded.metadata.email,
          {
            customerName: chargeSucceded.metadata.name,
            orderNumber: order.id,
            paymentDate: new Date().toISOString(),
            totalAmount: totalAmount.toString(),
            products: order.order_items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price.toString(),
            })),
          },
        );

        return savedOrder;

        break;
      default:
        console.log(`Event ${event.type} not handle`);
    }

    return res.status(200).json({ sig });
  }
}
