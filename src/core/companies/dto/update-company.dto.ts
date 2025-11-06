import {IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateCompanyDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre de la compañía es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;
}
