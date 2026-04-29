import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateMatchDto} from "./dto/create-match.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Match} from "./entity/matches.entity";
import {Court} from "../courts/entity/courts.entity";
import {Tournament} from "../tournament/entity/tournaments.entity";
import {Team} from "../teams/entity/teams.entity";

@Injectable()
export class MatchesService {

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: createMatchDto.tournamentId },
      relations: ['branch']
    });
    if (!tournament) {
      throw new BadRequestException({
        message: ['Torneo no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const court = await this.courtRepository.findOne({
      where: { id: createMatchDto.courtId },
      relations: ['branch']
    });
    if (!court) {
      throw new BadRequestException({
        message: ['Cancha no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (tournament.branch.id !== court.branch.id) {
      throw new BadRequestException({
        message: ['La sucursal del torneo no coincide con la sucursal de la cancha.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    const homeTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.homeTeamId },
      relations: ['tournament']
    });
    if (!homeTeam) {
      throw new BadRequestException({
        message: ['Equipo local no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const awayTeam = await this.teamRepository.findOne({
      where: { id: createMatchDto.awayTeamId },
      relations: ['tournament']
    });
    if (!awayTeam) {
      throw new BadRequestException({
        message: ['Equipo visitante no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (homeTeam.id === awayTeam.id) {
      throw new BadRequestException({
        message: ['Los equipos no pueden ser iguales.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (homeTeam.tournament.id !== awayTeam.tournament.id) {
      throw new BadRequestException({
        message: ['El torneo del equipo local no coincide con el torneo del equipo visitante.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newMatch = this.matchRepository.create({
      homeScore: createMatchDto.homeScore,
      awayScore: createMatchDto.awayScore,
      court: court,
      tournament: tournament,
      homeTeam: homeTeam,
      awayTeam: awayTeam
    });
    const savedMatch = await this.matchRepository.save(newMatch);

    return { match: savedMatch };
  }

  async findByTournamentId(tournamentId: number) {
    const matches = await this.matchRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['homeTeam', 'awayTeam', 'court']
    });
    if (!matches.length) {
      throw new BadRequestException({
        message: ['Equipos no encontrados.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    return { matches };
  }

  async findTableByTournamentId(tournamentId: number) {
    const teams = await this.teamRepository.findBy({
      tournament: { id: tournamentId }
    });
    if (!teams.length) {
      throw new BadRequestException({
        message: ['No hay equipos para el torneo.'],
        error: "Bad Request",
        statusCode: 400
      })
    }

    const table = {};

    teams.forEach(team => {
      table[team.id] = {
        team,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    });

    const matches = await this.matchRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['homeTeam', 'awayTeam']
    });

    matches.forEach(match => {
      const homeTeam = table[match.homeTeam.id];
      const awayTeam = table[match.awayTeam.id];

      homeTeam.played++;
      awayTeam.played++;

      homeTeam.goalsFor += match.homeScore;
      homeTeam.goalsAgainst += match.awayScore;

      awayTeam.goalsFor += match.awayScore;
      awayTeam.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        homeTeam.wins++;
        homeTeam.points += 3;
        awayTeam.losses++;
      } else if (match.homeScore < match.awayScore) {
        homeTeam.losses++;
        awayTeam.points += 3;
        awayTeam.wins++;
      } else {
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }
    });

    const sortedTeams = Object.values(table).sort((a: any, b: any) => {
      return (
        b.points - a.points ||
        (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor
      )
    });

    return { table: sortedTeams };
  }
}
