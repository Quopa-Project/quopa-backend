import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @ApiProperty({ example: 'string' })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
  @ApiProperty({ example: 'string' })
  phoneNumber: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;
}
