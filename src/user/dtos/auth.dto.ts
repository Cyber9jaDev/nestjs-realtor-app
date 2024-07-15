import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class SignUpDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
  
  @MinLength(5)
  @IsString()
  password: string;
  
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid phone number" })
  phone: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
  // product is used by an admin to validate a REALTOR
}

export class SignInDto{
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}