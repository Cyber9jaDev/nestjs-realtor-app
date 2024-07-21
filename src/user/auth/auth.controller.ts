import { Body, Controller, Get, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../types/user.type';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignUpDto, 
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
  ) {

    // In order to signup as a REALTOR, 
    // a key is needed from the ADMIN
    if(userType !== UserType.BUYER){
      if(!body.productKey){
        throw new UnauthorizedException()
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

      const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

      if(!isValidProductKey){
        throw new UnauthorizedException()
      }
    }

    return this.authService.signUp(body, userType);
  }

  @Post('/signin')
  signIn(@Body() body: SignInDto) { 
    return this.authService.signIn(body);
  }

  // Generate a key before user can sign up
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  } 

  // Identify the user  
  @Get('/me')
  me( @User() user: UserEntity ){ 
    return user
  }

}
