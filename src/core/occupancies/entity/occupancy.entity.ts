import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {OccupancyType} from "../../occupancy-types/entity/occupancy-type.entity";
import {Court} from "../../courts/entity/courts.entity";

@Entity()
export class Occupancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'json', nullable: true })
  days: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => OccupancyType)
  occupancyType: OccupancyType;

  @ManyToOne(() => Court)
  court: Court;
}