import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

// In order to use this INTERCEPTOR/TRANSFORMER, we need to modify the home.module.ts provider
// providers: [HomeService, { 
//   provide: APP_INTERCEPTOR,
//   useClass: ClassSerializerInterceptor
// }],

export class HomeResponseDto{
  id: number;
  address: string;
  price: number;
  city: string;
  propertyType: PropertyType;

  // Destructure home in the home.service.ts file in the getHomes method
  image: string

  @Exclude() updated: Date;
  @Exclude() created_at: Date;
  @Exclude() realtor_id: number

  @Exclude() number_of_bedrooms: number;
  @Expose({ name: "numberOfBedrooms" })
  numberOfBedrooms(){
    return this.number_of_bedrooms;
  }

  @Exclude() number_of_bathrooms: number;
  @Expose({ name: "numberOfBathrooms"})
  numberOfBathrooms(){
    return this.number_of_bedrooms;
  }

  @Exclude() listed_date: Date;
  @Expose({ name: "listedDate" })
  listedDate(){
    return this.listed_date;
  }

  @Exclude() land_size: number;
  @Expose({ name: "landSize" })
  landSize(){
    return this.land_size;
  }

  constructor(partial: Partial<HomeResponseDto>){
    Object.assign(this, partial)
  }
}


export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class createHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;  

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;    

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[]
}


export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBedrooms?: number;  

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBathrooms?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()

  @IsOptional()
  landSize?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;    
}