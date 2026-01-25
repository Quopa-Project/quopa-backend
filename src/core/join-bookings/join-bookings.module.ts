import { Module } from '@nestjs/common';
import { JoinBookingsController } from './join-bookings.controller';
import { JoinBookingsService } from './join-bookings.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JoinBooking} from "./entity/join-booking.entity";
import {Booking} from "../bookings/entity/booking.entity";
import {User} from "../users/entity/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([JoinBooking, Booking, User])
  ],
  controllers: [JoinBookingsController],
  providers: [JoinBookingsService]
})
export class JoinBookingsModule {}
