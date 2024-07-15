import { PropertyType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class HomeResponseDto{
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: "numberOfBedrooms"})
  numberOfBedrooms(){
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: "numberOfBathrooms"})
  numberOfBathrooms(){
    return this.number_of_bedrooms;
  }
  
  city: string;
  listed_date: Date;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  created_at: Date;
  updated: Date;
  realtor_id: number
}