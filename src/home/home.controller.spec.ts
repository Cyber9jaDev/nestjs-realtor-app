import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

const mockUser = {
  id: 53,
  name: 'Oladapo',
  phone: '080',
  email: 'test@gmail.com',
};

const mockHome = {
  id: 1,
  address: '2 Realtor Street',
  city: 'Ontario',
  price: 5070000,
  property_type: PropertyType.RESIDENTIAL,
  image: 'img1',
  number_of_bedrooms: 2,
  number_of_bathrooms: 2,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        DatabaseService,
        {
          provide: HomeService,
          useValue: {
            getHomes: () => jest.fn().mockReturnValue([]),
            getRealtorByHomeId: () => jest.fn().mockReturnValue(mockUser),
            updateHomeById: () => jest.fn().mockReturnValue(mockHome),
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

  describe('updateHome', () => {
    const mockUpdateHomeParams = {
      address: '2 Realtor Street',
      city: 'Ontario',
      numberOfBedrooms: 2,
      numberOfBathrooms: 2,
      price: 5070000,
      landSize: 1000,
      propertyType: PropertyType.RESIDENTIAL,
    };

    const mockUserEntity = {
      name: 'Oladapo',
      id: 30,
      iat: 12121,
      exp: 121212,
    };

    it("should throw unauthorized Error if realtor didn't create home ", async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserEntity),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
