import {IsBoolean, IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateJoinBookingDto {
  @IsNotEmpty({ message: 'El campo de pagado es obligatorio.' })
  @IsBoolean({ message: 'El campo de pagado debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isPayed: boolean;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNotEmpty({ message: 'El ID de la reserva es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la reserva debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  bookingId: number;
}
