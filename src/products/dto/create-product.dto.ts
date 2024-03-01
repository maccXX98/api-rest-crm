import { IsNotEmpty, IsString, Length, IsNumber, Min } from 'class-validator';

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
