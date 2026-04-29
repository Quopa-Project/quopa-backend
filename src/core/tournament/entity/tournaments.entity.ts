import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Branch} from "../../branches/entity/branches.entity";
import {TournamentStaff} from "../../tournament-staff/entity/tournament-staff.entity";

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Branch)
    branch: Branch;

    @OneToMany(() => TournamentStaff, (tournamentStaff) => tournamentStaff.tournament)
    tournamentStaff: TournamentStaff[];
}