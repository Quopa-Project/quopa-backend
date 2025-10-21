import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {User} from "./entity/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule} from "@nestjs/config";
import {JwtStrategy} from "../../security/jwt.strategy";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'Secret_Key_Quopa_Back_022506',
            signOptions: { expiresIn: '1w' }
        })
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy]
})
export class UsersModule {}
