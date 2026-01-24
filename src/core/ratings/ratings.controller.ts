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
import {RatingsService} from "./ratings.service";
import {CreateRatingDto} from "./dto/create-rating.dto";

@Controller('ratings')
export class RatingsController {

  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get('branch/:id')
  getRatingByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.ratingsService.findByBranchId(id);
  }
}
