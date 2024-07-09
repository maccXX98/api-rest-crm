import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  login: string;

  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}
