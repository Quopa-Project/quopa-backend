import { Module } from '@nestjs/common';
import { OccupanciesController } from './occupancies.controller';
import { OccupanciesService } from './occupancies.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Occupancy} from "./entity/occupancy.entity";
import {OccupancyType} from "../occupancy-types/entity/occupancy-type.entity";
import {Court} from "../courts/entity/courts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Occupancy, OccupancyType, Court])
  ],
  controllers: [OccupanciesController],
  providers: [OccupanciesService]
})
export class OccupanciesModule {}
