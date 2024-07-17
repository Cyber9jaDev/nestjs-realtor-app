import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { createHomeDto, HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService:HomeService){}
  
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]>{

    const price = minPrice || maxPrice ? {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    } : undefined;
    

    const filter = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType })
    }
    
    return this.homeService.getHomes(filter);
  }

  @Get(':id')
  getHome(){
    return {}
  }

  @Post()
  createHome(
    @Body() body: createHomeDto,
  ){
    return this.homeService.createHome(body)
  }

  @Put(":id")
  updateHome(){
    return {}
  }

  @Delete(":id")
  deleteHome(){
    return {}
  }

}