import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {SportsService} from "./sports.service";
import {CreateSportDto} from "./dto/create-sport.dto";

@Controller('sports')
export class SportsController {

  constructor(private readonly sportsService: SportsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.create(createSportDto);
  }

  @Get()
  getAll() {
    return this.sportsService.findAll();
  }
}
