import {IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    @ApiProperty({ example: 'string' })
    description: string;
}
