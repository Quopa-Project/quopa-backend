import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Tournament} from "../../tournament/entity/tournaments.entity";
import {User} from "../../users/entity/users.entity";

@Entity()
export class TournamentStaff {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Tournament)
    tournament: Tournament;

    @ManyToOne(() => User)
    user: User;
}