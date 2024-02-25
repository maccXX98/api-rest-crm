import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateDistributorDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  Name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  @Matches(/^[a-zA-Z\u00C0-\u017F\s]*$/, {
    message: 'Country must contain only letters, accents, and spaces',
  })
  Country: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 500)
  Address: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9+()-]*$/, {
    message: 'ContactPhone must contain only numbers and phone symbols',
  })
  @Length(1, 25)
  ContactPhone: string;
}
