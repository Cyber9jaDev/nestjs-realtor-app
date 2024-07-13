import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async signUp({ email, password, name, phone }: SignUpParams) {
    const userExists = await this.databaseService.user.findUnique({
      where: { email },
    });

    if(userExists){
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: "ADMIN",
      },
    });

    const token = await jwt.sign({
      name,
      id: user.id
    }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_LIFETIME
    })

    return token;
  }

  async signIn ({ email, password }: SignInParams){
    const user = await this.databaseService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new HttpException("Invalid Credentials", 400); 
    }

    const hashedPassword = user.password;
    
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if(!isValidPassword){

    }
  }
}
