import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class ValidationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountVerified: boolean;

    @Column()
    token: string;

    @Column()
    tokenExpiration: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}