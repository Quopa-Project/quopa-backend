import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiProperty({ example: 'string' })
  address: string;

  @IsNotEmpty({ message: 'El ID de la compañía es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la compañía debe ser un número.' })
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  companyId: number;
}
