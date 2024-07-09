import {
  IsString,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  Length,
  IsEmail,
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
  @Length(3, 25)
  @Matches(/^[0-9+\-()]*$/, {
    message: 'Teléfono solo puede contener números y signos de teléfono',
  })
  Phone: string;

  @IsOptional()
  Photo: Buffer;

  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'El rol solo puede contener letras y espacios',
  })
  Role: string;

  @IsString()
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  Username: string;

  @IsString()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @Length(5, 100)
  Email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(20, {
    message: 'La contraseña no puede tener más de 20 caracteres',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial',
    },
  )
  Password: string;
}
