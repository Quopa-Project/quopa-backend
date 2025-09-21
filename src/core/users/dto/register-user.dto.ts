import {IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users.entity';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @ApiProperty({ example: 'string' })
    lastName: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
    @IsPhoneNumber('PE', { message: "El número de teléfono debe ser válido." })
    @ApiProperty({ example: 'string' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
    @ApiProperty({ example: 'string' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    @ApiProperty({ example: 'string' })
    password: string;

    @IsNotEmpty({ message: 'El rol es obligatorio.' })
    @IsEnum(UserRole, { message: 'El rol debe ser válido.' })
    @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
    role: UserRole;
}
