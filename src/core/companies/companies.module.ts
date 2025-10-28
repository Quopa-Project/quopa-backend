import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./entity/companies.entity";
import {User} from "../users/entity/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
