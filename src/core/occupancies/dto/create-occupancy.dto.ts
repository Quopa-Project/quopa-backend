import {ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOccupancyDto {
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @ApiProperty({ example: 'string' })
  title: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDate({ message: 'La fecha de inicio debe ser correcta.' })
  @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  @IsDate({ message: 'La fecha de fin debe ser correcta.' })
  @ApiProperty({ example: '2025-02-01T21:59:59.999Z' })
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  @ApiProperty({ example: '08:00' })
  startTime: string;

  @IsNotEmpty({ message: 'La hora de fin es obligatoria.' })
  @ApiProperty({ example: '09:00' })
  endTime: string;

  @IsOptional()
  @IsArray({ message: 'Los días deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los días no pueden estar vacíos.' })
  @IsNumber({}, { each: true, message: 'Cada día debe ser un número.' })
  @ApiProperty({ example: [1, 2], required: false })
  days: number[];

  @IsNotEmpty({ message: 'El ID del tipo de ocupación es obligatorio.' })
  @IsNumber({}, { message: 'El ID del tipo de ocupación debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  occupancyTypeId: number;

  @IsNotEmpty({ message: 'El ID de la cancha es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la cancha debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  courtId: number;
}
