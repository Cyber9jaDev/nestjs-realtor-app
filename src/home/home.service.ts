import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HomeResponseDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService){}

  async getHomes(): Promise<HomeResponseDto[]>{
    const homes = await this.databaseService.home.findMany();
    return homes.map((home) => new HomeResponseDto(home))
  }
}
