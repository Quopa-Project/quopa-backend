import {IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateCourtDto {
  @IsOptional()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La capacidad es obligatoria.' })
  @IsNumber({}, { message: 'La capacidad debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  capacity: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 10 })
  price: number;
}
