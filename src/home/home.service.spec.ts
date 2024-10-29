import { Test, TestingModule } from '@nestjs/testing';
import { homeSelect, HomeService } from './home.service';
import { DatabaseService } from 'src/database/database.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockGetHomes = [
  {
    id: 15,
    address: '2 Realtor St',
    city: 'Ontario',
    price: 5070000,
    propertyType: PropertyType.RESIDENTIAL,
    image: 'img1',
    images: [{ url: 'img 1' }],
    numberOfBedrooms: 2,
    numberOfBathrooms: 2,
  },
];

describe('HomeService', () => {
  let homeService: HomeService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: DatabaseService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
            },
          },
        },
      ],
    }).compile();

    homeService = module.get<HomeService>(HomeService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Ibadan',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call Database findMany with correct params to return an array of homes', async () => {
      // mock the return value of the findMany method
      const mockDatabaseFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(databaseService.home, 'findMany')
        .mockImplementation(mockDatabaseFindManyHomes);
      await homeService.getHomes(filters);

      expect(mockDatabaseFindManyHomes).toHaveBeenCalledWith({
        where: { ...filters },
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
      });
    });

    it('should throw not found exception if no homes are found', async () => {
      const mockDatabaseFindManyHomes = jest.fn().mockReturnValue([]);
      jest
        .spyOn(databaseService.home, 'findMany')
        .mockImplementation(mockDatabaseFindManyHomes);
      await expect(homeService.getHomes(filters)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
