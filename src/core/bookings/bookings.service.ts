import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Booking, BookingStatus} from "./entity/booking.entity";
import {Court} from "../courts/entity/courts.entity";
import {User} from "../users/entity/users.entity";
import {CreateBookingDto} from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const court = await this.courtRepository.findOneBy({
      id: createBookingDto.courtId
    });
    if (!court) {
      throw new NotFoundException({
        message: ['Cancha no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const user = await this.userRepository.findOneBy({
      id: createBookingDto.userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (createBookingDto.numberOfPeople > court.capacity || createBookingDto.numberOfPeople < 1) {
      throw new BadRequestException({
        message: ['Capacidad incorrecta.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (createBookingDto.date.getDate() < new Date().getDate() || createBookingDto.date.getMonth() < new Date().getMonth() || createBookingDto.date.getFullYear() < new Date().getFullYear()) {
      throw new BadRequestException({
        message: ['Fecha incorrecta.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newBooking = this.bookingRepository.create({
      date: createBookingDto.date,
      time: createBookingDto.time,
      numberOfPeople: createBookingDto.numberOfPeople,
      isPublic: createBookingDto.isPublic,
      status: BookingStatus.PAYMENT_DUE,
      court: court,
      user: user,
    });
    const savedBooking = await this.bookingRepository.save(newBooking);

    return { booking: savedBooking };
  }
}
