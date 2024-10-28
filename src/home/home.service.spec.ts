import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { DatabaseService } from 'src/database/database.service';

describe('HomeService', () => {
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, DatabaseService],
    }).compile();

    homeService = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(homeService).toBeDefined();
  });
});
