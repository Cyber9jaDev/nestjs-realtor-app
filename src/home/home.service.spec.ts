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

const mockCreateHome = {
  id: 15,
  address: '2 Realtor Street',
  city: 'Ontario',
  price: 5070000,
  propertyType: PropertyType.RESIDENTIAL,
  image: 'img1',
  number_of_bedrooms: 2,
  number_of_bathrooms: 2,
  land_size: 1000,
};

const mockImages = [
  { id: 1, url: 'src1' },
  { id: 2, url: 'src2' },
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
              create: jest.fn().mockReturnValue(mockCreateHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
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

  describe('createHomes', () => {
    const mockCreateHomesParams = {
      address: '2 Realtor Street',
      city: 'Ontario',
      price: 5070000,
      propertyType: PropertyType.RESIDENTIAL,
      images: [{ url: 'img 1' }],
      numberOfBedrooms: 2,
      numberOfBathrooms: 2,
      landSize: 1000,
    };

    it('should call database home.create with the correct payload', async () => {
      const mockDatabaseCreateHome = jest.fn().mockReturnValue(mockCreateHome);
      jest
        .spyOn(databaseService.home, 'create')
        .mockImplementation(mockDatabaseCreateHome);
      await homeService.createHome(5, mockCreateHomesParams);
      expect(mockDatabaseCreateHome).toHaveBeenCalledWith({
        data: {
          address: '2 Realtor Street',
          city: 'Ontario',
          price: 5070000,
          propertyType: PropertyType.RESIDENTIAL,
          number_of_bedrooms: 2,
          number_of_bathrooms: 2,
          land_size: 1000,
          realtor_id: 5,
        },
      });

      // This tests for image creation
      expect(databaseService.image.createMany).toHaveBeenCalledWith({
        data: [{ url: 'img 1', home_id: 15 }],
      });
    });

    it('should ensure home images are also created', async () => {
      const mockCreateManyImages = jest.fn().mockReturnValue(mockImages);
      jest
        .spyOn(databaseService.image, 'createMany')
        .mockImplementation(mockCreateManyImages);
      await homeService.createHome(15, mockCreateHomesParams);
      expect(mockCreateManyImages).toHaveBeenCalledWith({
        data: [{ url: 'img 1', home_id: 15 }],
      });
    });
  });
});
