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
import {OccupanciesService} from "./occupancies.service";
import {CreateOccupancyDto} from "./dto/create-occupancy.dto";

@Controller('occupancies')
export class OccupanciesController {

  constructor(private readonly occupanciesService: OccupanciesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createOccupancyDto: CreateOccupancyDto) {
    return this.occupanciesService.create(createOccupancyDto);
  }

  @Get('court/:id')
  getOccupancyByCourtIdAndActive(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.occupanciesService.findByCourtIdAndActive(id);
  }
}
