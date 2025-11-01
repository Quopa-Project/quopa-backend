import { Module } from '@nestjs/common';
import { CourtsController } from './courts.controller';
import { CourtsService } from './courts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Court} from "./entity/courts.entity";
import {Branch} from "../branches/entity/branches.entity";
import {Sport} from "../sports/entity/sports.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Court, Branch, Sport]),
  ],
  controllers: [CourtsController],
  providers: [CourtsService]
})
export class CourtsModule {}
