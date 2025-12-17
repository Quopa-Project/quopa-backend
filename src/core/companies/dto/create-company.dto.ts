import {IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'El nombre de la compañía es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;
}
