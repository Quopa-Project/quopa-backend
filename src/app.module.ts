import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './core/users/users.module';
import { CompaniesModule } from './core/companies/companies.module';
import { BranchesModule } from './core/branches/branches.module';
import { SportsModule } from './core/sports/sports.module';
import { CourtsModule } from './core/courts/courts.module';
import { OccupanciesModule } from './core/occupancies/occupancies.module';
import { OccupancyTypesModule } from './core/occupancy-types/occupancy-types.module';
import { BookingsModule } from './core/bookings/bookings.module';
import { RatingsModule } from './core/ratings/ratings.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        UsersModule,
        CompaniesModule,
        BranchesModule,
        SportsModule,
        CourtsModule,
        OccupanciesModule,
        OccupancyTypesModule,
        BookingsModule,
        RatingsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
