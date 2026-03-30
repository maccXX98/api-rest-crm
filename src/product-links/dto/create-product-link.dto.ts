import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductLinkDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  link: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductId: number;
}
