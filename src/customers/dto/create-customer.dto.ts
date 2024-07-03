import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  @Matches(/^[0-9a-zA-Z]+$/, {
    message: 'Phone must contain only numbers and characters.',
  })
  phone: string;
}
