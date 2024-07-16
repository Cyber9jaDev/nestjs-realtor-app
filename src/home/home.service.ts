import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HomeResponseDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService){}

  async getHomes(): Promise<HomeResponseDto[]>{
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
      }
    });

    return homes.map((home) => new HomeResponseDto(home));

    // Destructure images directly
    // return homes.map((home) => new HomeResponseDto({ ...home, image: home.images[0].url}));
    
    // Since we are sending only the first image, 
    // remove images and send only the first image in the array of images
    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }
}
