import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {OccupancyTypesService} from "./occupancy-types.service";
import {CreateOccupancyTypeDto} from "./dto/create-occupancy-type.dto";

@Controller('occupancy-types')
export class OccupancyTypesController {

  constructor(private readonly occupancyTypesService: OccupancyTypesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createOccupancyTypeDto: CreateOccupancyTypeDto) {
    return this.occupancyTypesService.create(createOccupancyTypeDto);
  }

  @Get()
  getAll() {
    return this.occupancyTypesService.findAll();
  }
}
