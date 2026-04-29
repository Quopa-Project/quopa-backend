import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Tournament} from "./entity/tournaments.entity";
import {DataSource, Repository} from "typeorm";
import {User, UserRole} from "../users/entity/users.entity";
import {CreateTournamentDto} from "./dto/create-tournament.dto";
import {Team} from "../teams/entity/teams.entity";
import {Branch} from "../branches/entity/branches.entity";
import {Player} from "../players/entity/players.entity";
import {TournamentStaff} from "../tournament-staff/entity/tournament-staff.entity";

@Injectable()
export class TournamentsService {

  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private dataSource: DataSource
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const tournamentExisting = await this.tournamentRepository.findOneBy({
      name: createTournamentDto.name
    });
    if (tournamentExisting) {
      throw new BadRequestException({
        message: ['Torneo ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const user = await this.userRepository.findOneBy({
      id: createTournamentDto.userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const branch = await this.branchRepository.findOneBy({
      id: createTournamentDto.branchId
    });
    if (!branch) {
      throw new BadRequestException({
        message: ['Sucursal no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (user.role !== UserRole.TOURNAMENT_MANAGER) {
      throw new BadRequestException({
        message: ['Usuario no autorizado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    for (const team of createTournamentDto.teams) {
      const teamExisting = await this.teamRepository.findOneBy({
        name: team.name
      });
      if (teamExisting) {
        throw new BadRequestException({
          message: ['Equipo ya existente.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    }

    const savedTournament = await this.dataSource.transaction(async manager => {
      const tournamentRepository = manager.getRepository(Tournament);
      const tournamentStaffRepository = manager.getRepository(TournamentStaff);
      const teamRepository = manager.getRepository(Team);
      const playerRepository = manager.getRepository(Player);

      const newTournament = tournamentRepository.create({
        name: createTournamentDto.name,
        branch: branch
      });
      const savedTournament = await tournamentRepository.save(newTournament);

      const newTournamentStaff = tournamentStaffRepository.create({
        tournament: savedTournament,
        user: user
      });
      await tournamentStaffRepository.save(newTournamentStaff);

      for (const team of createTournamentDto.teams) {
        const newTeam = teamRepository.create({
          name: team.name,
          tournament: savedTournament
        });
        const savedTeam = await teamRepository.save(newTeam);

        for (const player of team.players) {
          const newPlayer = playerRepository.create({
            name: player.name,
            number: player.number,
            team: savedTeam
          });
          await playerRepository.save(newPlayer);
        }
      }

      return savedTournament;
    });

    return { tournament: savedTournament };
  }

  async validateTournamentName(name: string) {
    const tournamentExisting = await this.tournamentRepository.findOneBy({
      name
    });
    if (tournamentExisting) {
      throw new BadRequestException({
        message: ['Torneo ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    return { message: "Nombre de torneo libre" };
  }

  async findByIdAndUserId(id: number, userId: number) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, tournamentStaff: { user: { id: userId } } },
      relations: ['branch']
    });
    if (!tournament) {
      throw new NotFoundException({
        message: ['Torneo no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { tournament };
  }

  async findByUserId(userId: number) {
    const tournaments = await this.tournamentRepository.find({
      where: { tournamentStaff: { user: { id: userId } } },
      relations: ['branch', 'branch.company']
    });
    if (!tournaments.length) {
      throw new NotFoundException({
        message: ['Torneos no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { tournaments };
  }
}
