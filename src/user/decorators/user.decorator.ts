import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../types/user.type';

// Reusable component
export const User = createParamDecorator((data, context: ExecutionContext): UserEntity => {
  const request = context.switchToHttp().getRequest();
  return request.user
});