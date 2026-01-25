import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JoinBooking, JoinBookingStatus} from "./entity/join-booking.entity";
import {Booking, BookingStatus} from "../bookings/entity/booking.entity";
import {User} from "../users/entity/users.entity";
import {CreateJoinBookingDto} from "./dto/create-join-booking.dto";
import {UpdateJoinBookingDto} from "./dto/update-join-booking.dto";

@Injectable()
export class JoinBookingsService {

  constructor(
    @InjectRepository(JoinBooking)
    private joinBookingRepository: Repository<JoinBooking>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createJoinBookingDto: CreateJoinBookingDto) {
    const booking = await this.bookingRepository.findOneBy({
      id: createJoinBookingDto.bookingId
    });
    if (!booking) {
      throw new NotFoundException({
        message: ['Reserva no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const user = await this.userRepository.findOneBy({
      id: createJoinBookingDto.userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (booking.status === BookingStatus.FINISHED || booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException({
        message: ['Reserva no puede tener peticiones.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newJoinBooking = this.joinBookingRepository.create({
      isPayed: createJoinBookingDto.isPayed,
      status: JoinBookingStatus.REQUESTED,
      booking: booking,
      user: user,
    });
    const savedJoinBooking = await this.joinBookingRepository.save(newJoinBooking);

    return { joinBooking: savedJoinBooking };
  }

  async findByUserId(userId: number) {
    const joinBookings = await this.joinBookingRepository.find({
      where: { user: { id: userId } },
      relations: ['booking', 'booking.court.branch', 'booking.court.sport']
    });
    if (!joinBookings.length) {
      throw new NotFoundException({
        message: ['Peticiones de reserva no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { joinBookings };
  }

  async findByBookingId(bookingId: number) {
    const joinBookings = await this.joinBookingRepository.find({
      where: { booking: { id: bookingId } },
      relations: ['booking', 'booking.court.branch', 'user']
    });
    if (!joinBookings.length) {
      throw new NotFoundException({
        message: ['Peticiones de reserva no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { joinBookings };
  }

  async findById(id: number) {
    const joinBooking = await this.joinBookingRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.court.branch', 'booking.court.sport', 'user']
    });
    if (!joinBooking) {
      throw new NotFoundException({
        message: ['Petición de reserva no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { joinBooking };
  }

  async updateById(id: number, updateJoinBookingDto: UpdateJoinBookingDto) {
    const joinBooking = await this.joinBookingRepository.findOneBy({
      id
    });
    if (!joinBooking) {
      throw new NotFoundException({
        message: ['Petición de reserva no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.joinBookingRepository.update(id, updateJoinBookingDto);

    return this.findById(id);
  }
}
