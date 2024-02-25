import { IsNotEmpty, IsInt, IsPositive, Min, IsNumber } from 'class-validator';

export class CreateProductOrderDetailDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  ProductOrderID: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  ProductID: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @IsPositive()
  Quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  TotalAmount: number;
}
