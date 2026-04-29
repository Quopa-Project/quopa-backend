import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Match} from "./entity/matches.entity";
import {Tournament} from "../tournament/entity/tournaments.entity";
import {Team} from "../teams/entity/teams.entity";
import {Court} from "../courts/entity/courts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Tournament, Team, Court]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
