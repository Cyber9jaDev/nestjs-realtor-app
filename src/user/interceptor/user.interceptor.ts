import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ){
    
    // Extract the token from the request headers
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1];
    const user = jwt.decode(token);

    // The decorator will extract this newly created user property
    // Attach this property to the request object 
    request.user = user;

    return handler.handle();
  }
}
