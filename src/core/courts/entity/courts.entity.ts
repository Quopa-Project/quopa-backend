import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {Branch} from "../../branches/entity/branches.entity";
import {Sport} from "../../sports/entity/sports.entity";

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Branch)
  branch: Branch;

  @ManyToOne(() => Sport)
  sport: Sport;
}