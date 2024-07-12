import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async signUp({ email }: SignUpParams) {
    const userExists = await this.databaseService.user.findUnique({
      where: { email },
    });

    console.log(userExists);
  }
}
