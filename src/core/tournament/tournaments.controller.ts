import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param, ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {TournamentsService} from "./tournaments.service";
import {CreateTournamentDto} from "./dto/create-tournament.dto";

@Controller('tournaments')
export class TournamentsController {

  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get('validate-name/:name')
  validateTournamentName(@Param('name') name: string) {
    return this.tournamentsService.validateTournamentName(name);
  }

  @Get(':id/user/:userId')
  getTournamentByIdAndUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Param('userId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) userId: number) {
    return this.tournamentsService.findByIdAndUserId(id, userId);
  }

  @Get('user/:id')
  getTournamentsByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.tournamentsService.findByUserId(id);
  }
}
