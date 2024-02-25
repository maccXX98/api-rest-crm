import {
  IsString,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede tener más de 150 caracteres' })
  @Matches(/^[a-zA-Z\s-áéíóúÁÉÍÓÚñÑ]*$/, {
    message:
      'El nombre solo puede contener letras, espacios, acentos y guiones',
  })
  FirstName: string;

  @IsString()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(150, {
    message: 'El apellido no puede tener más de 150 caracteres',
  })
  @Matches(/^[a-zA-Z\s-áéíóúÁÉÍÓÚñÑ]*$/, {
    message:
      'El apellido solo puede contener letras, espacios, acentos y guiones',
  })
  LastName: string;

  @IsString()
  @Length(1, 25)
  @Matches(/^[0-9+\-()]*$/, {
    message: 'Teléfono solo puede contener números y signos de teléfono',
  })
  Phone: string;

  @IsOptional()
  Photo: Buffer;
}
