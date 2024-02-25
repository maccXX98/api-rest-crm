import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  Cost: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  SellingPrice: number;

  @IsString()
  Template: string;

  @IsString()
  @Length(1, 255)
  Image: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  DistributorID: number;
}
