import { PropertyType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

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