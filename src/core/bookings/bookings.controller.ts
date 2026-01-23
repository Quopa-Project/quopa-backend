import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {BookingsService} from "./bookings.service";
import {CreateBookingDto} from "./dto/create-booking.dto";

@Controller('bookings')
export class BookingsController {

  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
}
