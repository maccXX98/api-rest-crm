import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  Name: string;

  @IsString()
  @Length(3, 150)
  NickName: string;

  @IsString()
  Description: string;

  @IsNumber()
  Cost: number;

  @IsNotEmpty()
  @IsNumber()
  SellingPrice: number;

  @IsString()
  Template: string;

  @IsString()
  @Length(1, 255)
  Image: string;

  @IsNotEmpty()
  @IsNumber()
  DistributorID: number;
}
