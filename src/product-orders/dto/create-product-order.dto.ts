import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsPositive,
  IsDateString,
} from 'class-validator';

export class CreateProductOrderDto {
  @IsNotEmpty()
  @IsUUID()
  UserID: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  DistributorID: number;

  @IsNotEmpty()
  @IsDateString()
  OrderDate: Date;
}
