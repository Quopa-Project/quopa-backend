import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {User} from "../../users/entity/users.entity";
import {Booking} from "../../bookings/entity/booking.entity";

export enum JoinBookingStatus {
  REQUESTED = 'Solicitado', CONFIRMED = 'Confirmado', CANCELED = 'Cancelado'
}

@Entity()
export class JoinBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isPayed: boolean;

  @Column({ type: 'enum', enum: JoinBookingStatus })
  status: JoinBookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Booking)
  booking: Booking;
}