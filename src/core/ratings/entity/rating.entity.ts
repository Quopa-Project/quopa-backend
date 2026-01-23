import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {Booking} from "../../bookings/entity/booking.entity";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;
}