import {IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class UpdateBranchDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiPropertyOptional({ example: 'string' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiPropertyOptional({ example: 'string' })
  address: string;
}
