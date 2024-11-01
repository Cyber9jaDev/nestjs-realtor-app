import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

// In order to use this INTERCEPTOR/TRANSFORMER, we need to modify the home.module.ts provider
// providers: [HomeService, {
//   provide: APP_INTERCEPTOR,
//   useClass: ClassSerializerInterceptor
// }],

export class HomeResponseDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the home' })
  id: number;

  @ApiProperty({ example: '111 Realtor Street' })
  address: string;

  @ApiProperty({ example: 150000 })
  price: number;

  @ApiProperty({ example: 'Maryland' })
  city: string;

  @ApiProperty({
    enum: ['CONDO', 'RESIDENTIAL'],
    example: PropertyType.RESIDENTIAL,
  })
  propertyType: PropertyType;

  // Destructure home in the home.service.ts file in the getHomes method
  @ApiProperty({ example: 'https://picsum.photos/200/300' })
  image: string;

  @Exclude() updated: Date;
  @Exclude() created_at: Date;
  @Exclude() realtor_id: number;

  @Exclude() number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude() number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude() listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Exclude() land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @ApiProperty({ example: '11 Mayfair Avenue' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Maryland' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @ApiProperty({ example: 1250000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 4554 })
  @IsNumber()
  @IsPositive()
  landSize: number;

  @ApiProperty({ enum: ['CONDO', 'RESIDENTIAL'] })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @ApiPropertyOptional({ example: '111 Realtor Street' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBedrooms?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBathrooms?: number;

  @ApiPropertyOptional({ example: 'Maryland' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 35000 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;


  @ApiProperty({ example: 4000 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  landSize?: number;

  @ApiPropertyOptional({
    enum: ['RESIDENTIAL', 'CONDO'],
    example: PropertyType.RESIDENTIAL,
  })
  @ApiPropertyOptional()
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
