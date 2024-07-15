import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService){}

  getHomes(){
    return this.databaseService.home.findMany();
  }
}
