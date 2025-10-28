import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'El nombre de la compañía es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    userId: number;
}
