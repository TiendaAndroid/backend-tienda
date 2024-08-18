import {
     createParamDecorator,
     ExecutionContext,
     InternalServerErrorException,
     UnauthorizedException,
   } from '@nestjs/common';
   
   // Decorador para obtener Header
   // Autor: Fidel Bonilla
   export const RawHeaders = createParamDecorator(
     (data: string, ctx: ExecutionContext) => {
       const req = ctx.switchToHttp().getRequest();
       return req.rawHeaders
     },
   );
   