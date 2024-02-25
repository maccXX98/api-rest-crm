import { IsNotEmpty, IsInt, IsPositive, IsDecimal, Min } from 'class-validator';

export class CreateDistributorRelationDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  DistributorID: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @IsPositive()
  TotalOrders: number;

  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  @IsPositive()
  TotalSpent: number;
}
