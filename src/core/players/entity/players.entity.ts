import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Team} from "../../teams/entity/teams.entity";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    number: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Team)
    team: Team;
}