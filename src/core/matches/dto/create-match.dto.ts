import {IsNotEmpty, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";

export class CreateMatchDto {
    @IsNotEmpty({ message: 'El score del equipo local es obligatorio.' })
    @IsNumber({}, { message: 'El score del equipo local debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 10 })
    homeScore: number;

    @IsNotEmpty({ message: 'El score del equipo visitante es obligatorio.' })
    @IsNumber({}, { message: 'El score del equipo visitante debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 10 })
    awayScore: number;

    @IsNotEmpty({ message: 'El ID del equipo local es obligatorio.' })
    @IsNumber({}, { message: 'El ID del equipo local debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    homeTeamId: number;

    @IsNotEmpty({ message: 'El ID del equipo visitante es obligatorio.' })
    @IsNumber({}, { message: 'El ID del equipo visitante debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    awayTeamId: number;

    @IsNotEmpty({ message: 'El ID del torneo es obligatorio.' })
    @IsNumber({}, { message: 'El ID del torneo debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    tournamentId: number;

    @IsNotEmpty({ message: 'El ID de la cancha es obligatorio.' })
    @IsNumber({}, { message: 'El ID de la cancha debe ser un número.' })
    @Type(() => Number)
    @ApiProperty({ example: 1 })
    courtId: number;
}
