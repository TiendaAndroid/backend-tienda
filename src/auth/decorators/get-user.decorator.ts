import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

// Decorador para obtener el usuario
// Autor: Fidel Bonilla
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException('User not found (request');
    }
    return !data ? user : user[data];
  },
);
