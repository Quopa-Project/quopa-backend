import {IsBoolean, IsDate, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDate({ message: 'La fecha de inicio debe ser correcta.' })
  @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
  @Type(() => Date)
  date: Date;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  @ApiProperty({ example: '08:00' })
  time: string;

  @IsNotEmpty({ message: 'La cantidad de personas es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad de personas debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  numberOfPeople: number;

  @IsNotEmpty({ message: 'El campo de público es obligatorio.' })
  @IsBoolean({ message: 'El campo de público debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isPublic: boolean;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNotEmpty({ message: 'El ID de la cancha es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la cancha debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  courtId: number;
}
