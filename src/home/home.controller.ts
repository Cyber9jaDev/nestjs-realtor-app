import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { createHomeDto, HomeResponseDto, InquireDto, UpdateHomeDto } from './dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/types/user.type';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filter = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filter);
  }

  @Get(':id')
  getHome() {
    return {};
  }

  @Roles(UserType.REALTOR)
  @Post()
  createHome(
    @Body() createHomeDto: createHomeDto, 
    @User() user: UserEntity
  ) {
    return this.homeService.createHome(user.id, createHomeDto);
  }

  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeDto: UpdateHomeDto,
    @User() user: UserEntity,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHomeById(id, updateHomeDto);
  }

  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHomeById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    // Ensure only the person that created a home can delete a certain home
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  async inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() buyer: UserEntity,
    @Body() { message }: InquireDto
  ){
    return this.homeService.inquire(buyer, homeId, message)
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity
  ){
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if(realtor.id !== user.id){
      throw new UnauthorizedException
    }
    return this.homeService.getHomeMessages(id)
  }
}
