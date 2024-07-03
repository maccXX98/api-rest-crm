import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePaymentMetodDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  metod: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  image: string;
}
