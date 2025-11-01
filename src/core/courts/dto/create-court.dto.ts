import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCourtDto {
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @IsNotEmpty({ message: 'La capacidad es obligatoria.' })
  @IsNumber({}, { message: 'La capacidad debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  capacity: number;

  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 10 })
  price: number;

  @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsNotEmpty({ message: 'El ID del deporte es obligatorio.' })
  @IsNumber({}, { message: 'El ID del deporte debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  sportId: number;
}
