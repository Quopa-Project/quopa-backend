import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param, ParseBoolPipe,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {BookingsService} from "./bookings.service";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {UpdateBookingDto} from "./dto/update-booking.dto";

@Controller('bookings')
export class BookingsController {

  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get('user/:id')
  getBookingByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.bookingsService.findByUserId(id);
  }

  @Get('branch/:id')
  getBookingByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.bookingsService.findByBranchId(id);
  }

  @Get('isPublic/:isPublic')
  getBookingByIsPublic(@Param('isPublic', new ParseBoolPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser verdadero o falso") })) isPublic: boolean) {
    return this.bookingsService.findByIsPublic(isPublic);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.updateById(id, updateBookingDto);
  }
}
