import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  variantName: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductId: number;
}
