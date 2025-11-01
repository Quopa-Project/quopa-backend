import { Module } from '@nestjs/common';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Sport} from "./entity/sports.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Sport]),
  ],
  controllers: [SportsController],
  providers: [SportsService]
})
export class SportsModule {}
