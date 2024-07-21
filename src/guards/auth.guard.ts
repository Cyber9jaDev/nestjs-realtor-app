import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from '../database/database.service';

interface JWTPayload{
  name: string;
  id: number;
  iat: number;
  exp: number
}

// Reflector allows us to access metadata
// Grab the roles from the reflector

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    // 1. Determine What user types(roles) are able to execute the endpoint that is being called
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      // 2. Identify and verify the user (Grab the JWT from the request header and verify it)
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split(' ')[1];

      try {
        const payload = jwt.verify(token, process.env.JWT_KEY) as JWTPayload;
        
        const user = await this.databaseService.user.findUnique({ where: { id: payload?.id}})

        // 3. Determine if the user is a Buyer, Admin or Realtor by making a Database request to get user by id
        if(!user) return false;
        // 4. Determine if the user has permission
        if(roles.includes(user.user_type)) return true;

        return false;

      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
