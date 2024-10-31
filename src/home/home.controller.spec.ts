import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: () => jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      // Create a function that returns an empty array
      const mockGetHomes = jest.fn().mockReturnValue([]);
      // Spy on homeService and get the getHomes method
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Ibadan', '1000');
      // getHomes from homeService -:- getHomes(filter: Filter)
      expect(mockGetHomes).toHaveBeenCalledWith({
        city: 'Ibadan', //city
        price: {
          gte: 1000, // minPrice
        },
      });
    });
  });
});
