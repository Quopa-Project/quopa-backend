import {IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOccupancyTypeDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'El ícono es obligatorio.' })
    @ApiProperty({ example: 'string' })
    icon: string;
}
