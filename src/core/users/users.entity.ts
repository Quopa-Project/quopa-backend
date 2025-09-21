import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN', ADMIN = 'ADMIN', BRANCH = 'BRANCH', CLIENT = 'CLIENT'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column()
    tokenVersion: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}