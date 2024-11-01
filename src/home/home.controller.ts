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
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/types/user.type';
import { Roles } from 'src/decorators/roles.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all homes' })
  @ApiResponse({ status: 200, description: 'OK', type: [HomeResponseDto], isArray: true })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: String })
  @ApiQuery({ name: 'maxPrice', required: false, type: String })
  @ApiQuery({ name: 'propertyType', required: false, enum: PropertyType })
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

  @Roles(UserType.REALTOR)
  @Post()
  @ApiOperation({
    summary: 'Create new home',
    description:
      'Creates a new home listing. Only accessible to users with REALTOR role.',
  })
  @ApiBody({ type: CreateHomeDto, description: 'Home details to create' })
  @ApiResponse({ status: 200, description: 'Home created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have REALTOR role',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserEntity) {
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
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(buyer, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.getHomeMessages(id);
  }
}
