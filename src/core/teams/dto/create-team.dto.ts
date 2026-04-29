import {ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Type} from "class-transformer";
import {CreatePlayerDto} from "../../players/dto/create-player.dto";

export class CreateTeamDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @ApiProperty({ example: 'string' })
    name: string;

    @IsArray({ message: 'Los jugadores deben ser una lista.' })
    @ArrayNotEmpty({ message: 'Los jugadores no pueden estar vacíos.' })
    @ValidateNested({ each: true, message: 'Cada jugador debe ser válido.' })
    @ApiProperty({
        example: [
            { name: 'Juan', number: 10 }
        ]
    })
    @Type(() => CreatePlayerDto)
    players: CreatePlayerDto[];
}
