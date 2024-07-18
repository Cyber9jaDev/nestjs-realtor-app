import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HomeResponseDto } from './dtos/home.dto';
import { CreateHomeParams, FilterQueries, UpdateHomeParams } from './types/home.types';

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService){}

  async getHomes(filter : FilterQueries): Promise<HomeResponseDto[]>{
    
    const homes = await this.databaseService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        images: {
          select: {
            url: true
          },
          take: 1
        }
      },
      where: { ...filter }
    });

    if(!homes.length){
      throw new NotFoundException()
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

  async createHome ({address, numberOfBathrooms, numberOfBedrooms, city, landSize, propertyType, price, images }: CreateHomeParams){
    const home = await this.databaseService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBathrooms,
        number_of_bathrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        price,
        propertyType,
        realtor_id: 5
      }
    });

    // Create Images for the home
    await this.databaseService.image.createMany({
      data: images.map((image) => {
        return {
          ...image, 
          home_id: home.id
        }
      })
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById (id: number, data: UpdateHomeParams){
    const home = await this.databaseService.home.findUnique({
      where: { id }
    });
    if(!home){
      throw new NotFoundException();
    }
    const updatedHome = await this.databaseService.home.update({
      where: { id },
      data: { ...data }
    });

    return new HomeResponseDto(home);
  }

}


