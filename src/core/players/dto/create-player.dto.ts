import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreatePlayerDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNumber({}, { message: 'El número de camiseta debe ser un número.' })
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    number: number;
}
