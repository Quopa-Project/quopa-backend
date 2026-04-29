import {BadRequestException, Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {TeamsService} from "./teams.service";

@Controller('teams')
export class TeamsController {

  constructor(private readonly teamsService: TeamsService) {}

  @Get('validate-name/:name')
  validateTournamentName(@Param('name') name: string) {
    return this.teamsService.validateTeamName(name);
  }

  @Get('tournament/:tournamentId')
  getTeamsByTournamentId(@Param('tournamentId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) tournamentId: number) {
    return this.teamsService.findByTournamentId(tournamentId);
  }
}
