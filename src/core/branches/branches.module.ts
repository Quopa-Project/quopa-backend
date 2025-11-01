import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Branch} from "./entity/branches.entity";
import {User} from "../users/entity/users.entity";
import {Company} from "../companies/entity/companies.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, User, Company]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService]
})
export class BranchesModule {}
