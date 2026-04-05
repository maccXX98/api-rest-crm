import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  variations?: string;

  @IsOptional()
  @IsBoolean()
  cashOnDelivery?: boolean;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  image: string;
}
