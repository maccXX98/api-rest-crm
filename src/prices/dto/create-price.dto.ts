import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @IsPositive()
  Cost: number;

  @IsNumber()
  @IsPositive()
  SellingPrice: number;

  @IsString()
  Currency: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  ProductID: number;
}
