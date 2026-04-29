import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Court} from "../../courts/entity/courts.entity";
import {Team} from "../../teams/entity/teams.entity";
import {Tournament} from "../../tournament/entity/tournaments.entity";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    homeScore: number;

    @Column()
    awayScore: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Court)
    court: Court;

    @ManyToOne(() => Tournament)
    tournament: Tournament;

    @ManyToOne(() => Team)
    homeTeam: Team;

    @ManyToOne(() => Team)
    awayTeam: Team;
}