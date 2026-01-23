import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Booking, BookingStatus} from "../bookings/entity/booking.entity";
import {Rating} from "./entity/rating.entity";
import {CreateRatingDto} from "../bookings/dto/create-rating.dto";

@Injectable()
export class RatingsService {

  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const booking = await this.bookingRepository.findOneBy({
      id: createRatingDto.bookingId
    });
    if (!booking) {
      throw new NotFoundException({
        message: ['Reserva no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.FINISHED) {
      throw new BadRequestException({
        message: ['No se puede crear una calificación a esta reserva.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newRating = this.ratingRepository.create({
      score: createRatingDto.score,
      comment: createRatingDto.comment,
      booking: booking,
    });
    const savedRating = await this.ratingRepository.save(newRating);

    return { rating: savedRating };
  }
}
