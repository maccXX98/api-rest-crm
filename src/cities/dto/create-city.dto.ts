import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  image: string;
}
