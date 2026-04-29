import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";
import {CreateTeamDto} from "../../teams/dto/create-team.dto";

export class CreateTournamentDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsNotEmpty({ message: 'El ID de la sucursal es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la sucursal debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    branchId: number;

    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    userId: number;

    @IsArray({ message: 'Los equipos deben ser una lista.' })
    @ArrayNotEmpty({ message: 'Los equipo no pueden estar vacíos.' })
    @ValidateNested({ each: true, message: 'Cada equipo debe ser válido.' })
    @ApiProperty({
        example: [
            { name: 'Los poderosos', players: [{ name: 'Juan', number: 10 }] }
        ]
    })
    @Type(() => CreateTeamDto)
    teams: CreateTeamDto[];
}
