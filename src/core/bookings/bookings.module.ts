import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Booking} from "./entity/booking.entity";
import {User} from "../users/entity/users.entity";
import {Court} from "../courts/entity/courts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Court])
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
