import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HomeResponseDto } from './dtos/home.dto';
import {
  CreateHomeParams,
  FilterQueries,
  UpdateHomeParams,
} from './types/home.types';
import { UserEntity } from 'src/user/types/user.type';

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  propertyType: true,
  number_of_bedrooms: true,
  number_of_bathrooms: true,
}

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getHomes(filter: FilterQueries): Promise<HomeResponseDto[]> {
    const homes = await this.databaseService.home.findMany({
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: { ...filter },
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => new HomeResponseDto(home));

    // Since we are sending only the first image,
    // remove images and send only the first image in the array of images
    // return homes.map((home) => {
    //   const fetchedHome = { ...home, image: home.images[0].url };
    //   delete fetchedHome.images;
    //   return new HomeResponseDto(fetchedHome);
    // });
  }

  async createHome(
    userId: number,
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      propertyType,
      price,
      images,
    }: CreateHomeParams,
  ) {
    const home = await this.databaseService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBathrooms,
        number_of_bathrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        price,
        propertyType,
        realtor_id: userId,
      },
    });

    // Create Images for the home
    await this.databaseService.image.createMany({
      data: images.map((image) => {
        return {
          ...image,
          home_id: home.id,
        };
      }),
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, data: UpdateHomeParams) {
    const home = await this.databaseService.home.findUnique({
      where: { id },
    });
    if (!home) {
      throw new NotFoundException();
    }
    const updatedHome = await this.databaseService.home.update({
      where: { id },
      data: { ...data },
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.databaseService.image.deleteMany({
      where: { home_id: id },
    });

    const home = await this.databaseService.home.delete({
      where: { id },
    });

    if (!home) {
      throw new NotFoundException();
    }
    return new HomeResponseDto(home);
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.databaseService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return home.realtor;
  }

  async inquire(buyer: UserEntity, homeId: number, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId);

    return await this.databaseService.message.create({
      data: {
        message,
        buyer_id: buyer.id,
        realtor_id: realtor.id,
        home_id: homeId,
      },
    });
  }

  async getHomeMessages(homeId: number) {
    return this.databaseService.message.findMany({
      where: { home_id: homeId },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}
