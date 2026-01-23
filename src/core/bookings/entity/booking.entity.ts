import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {Court} from "../../courts/entity/courts.entity";
import {User} from "../../users/entity/users.entity";

export enum BookingStatus {
  PAYMENT_DUE = 'Pago Pendiente', CONFIRMED = 'Confirmado', CANCELED = 'Cancelado', FINISHED = 'Terminado'
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column()
  numberOfPeople: number;

  @Column()
  isPublic: boolean;

  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Court)
  court: Court;
}