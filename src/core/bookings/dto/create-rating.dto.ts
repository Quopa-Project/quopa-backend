import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @IsNotEmpty({ message: 'La calificación es obligatoria.' })
  @IsNumber({}, { message: 'La calificación debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  score: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El comentario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  comment: string;

  @IsNotEmpty({ message: 'El ID de la reserva es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la reserva debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  bookingId: number;
}
