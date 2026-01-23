import {IsEnum} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {BookingStatus} from "../entity/booking.entity";

export class UpdateBookingDto {
  @IsEnum(BookingStatus, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  status: BookingStatus;
}
