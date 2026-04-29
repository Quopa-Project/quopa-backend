import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Tournament} from "./entity/tournaments.entity";
import {User} from "../users/entity/users.entity";
import {Team} from "../teams/entity/teams.entity";
import {Branch} from "../branches/entity/branches.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, User, Team, Branch]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService]
})
export class TournamentsModule {}
