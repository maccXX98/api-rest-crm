import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePaymentMetodDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  method: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  image: string;
}
