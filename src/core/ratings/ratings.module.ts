import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Rating} from "./entity/rating.entity";
import {Booking} from "../bookings/entity/booking.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, Booking])
  ],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
