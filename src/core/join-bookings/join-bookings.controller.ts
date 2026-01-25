import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {JoinBookingsService} from "./join-bookings.service";
import {CreateJoinBookingDto} from "./dto/create-join-booking.dto";
import {UpdateJoinBookingDto} from "./dto/update-join-booking.dto";

@Controller('join-bookings')
export class JoinBookingsController {

  constructor(private readonly joinBookingsService: JoinBookingsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createJoinBookingDto: CreateJoinBookingDto) {
    return this.joinBookingsService.create(createJoinBookingDto);
  }

  @Get('user/:id')
  getBookingByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.joinBookingsService.findByUserId(id);
  }

  @Get('booking/:id')
  getBookingByBookingId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.joinBookingsService.findByBookingId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateJoinBookingDto: UpdateJoinBookingDto) {
    return this.joinBookingsService.updateById(id, updateJoinBookingDto);
  }
}
