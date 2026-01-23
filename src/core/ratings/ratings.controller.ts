import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {RatingsService} from "./ratings.service";
import {CreateRatingDto} from "../bookings/dto/create-rating.dto";

@Controller('ratings')
export class RatingsController {

  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }
}
