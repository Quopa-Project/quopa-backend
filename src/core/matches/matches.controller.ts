import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {MatchesService} from "./matches.service";
import {CreateMatchDto} from "./dto/create-match.dto";

@Controller('matches')
export class MatchesController {

  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get('tournament/:tournamentId')
  getMatchesByTournamentId(@Param('tournamentId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) tournamentId: number) {
    return this.matchesService.findByTournamentId(tournamentId);
  }

  @Get('table/:tournamentId')
  getTableByTournamentId(@Param('tournamentId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) tournamentId: number) {
    return this.matchesService.findTableByTournamentId(tournamentId);
  }
}
