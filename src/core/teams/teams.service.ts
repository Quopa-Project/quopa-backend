import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Team} from "./entity/teams.entity";
import {Repository} from "typeorm";

@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async validateTeamName(name: string) {
    const teamExisting = await this.teamRepository.findOneBy({
      name
    });
    if (teamExisting) {
      throw new BadRequestException({
        message: ['Equipo ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    return { message: "Nombre de equipo libre" };
  }

  async findByTournamentId(tournamentId: number) {
    const teams = await this.teamRepository.findBy({
      tournament: { id: tournamentId }
    });
    if (!teams.length) {
      throw new BadRequestException({
        message: ['Equipos no encontrados.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    return { teams };
  }
}
