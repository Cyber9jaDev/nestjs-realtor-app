import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";

// Roles
// Return true or false

// Reflector allows us to access metadata
// Grab the roles from the reflector
// 3. Determine if the user is a Buyer, Admin or Realtor by making a Database request to get user by id
// 4. Determine if the user has permission

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // 1. Determine What user types(roles) are able to execute the endpoint that is being called 
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    if(roles.length){
      // 2. Identify and verify the user (Grab the JWT from the request header and verify it)
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split(" ")[1]
    }

    return true;
  }
}
