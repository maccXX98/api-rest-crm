import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductId: number;
}
