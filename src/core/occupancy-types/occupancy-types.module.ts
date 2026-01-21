import { Module } from '@nestjs/common';
import { OccupancyTypesController } from './occupancy-types.controller';
import { OccupancyTypesService } from './occupancy-types.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OccupancyType} from "./entity/occupancy-type.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([OccupancyType])
  ],
  controllers: [OccupancyTypesController],
  providers: [OccupancyTypesService]
})
export class OccupancyTypesModule {}
