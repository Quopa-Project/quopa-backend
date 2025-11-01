import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Sport} from "./entity/sports.entity";

@Injectable()
export class SportsService {

  constructor(
    @InjectRepository(Sport)
    private sportRepository: Repository<Sport>,
  ) {}

  async create(createSportDto: any) {
    const sportExisting = await this.sportRepository.findOneBy({
      name: createSportDto.name
    });
    if (sportExisting) {
      throw new BadRequestException({
        message: ['Deporte ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newSport = this.sportRepository.create({
      name: createSportDto.name,
      description: createSportDto.description,
    });
    const savedSport = await this.sportRepository.save(newSport);

    return { sport: savedSport };
  }

  async findAll() {
    const sports = await this.sportRepository.find();
    if (!sports.length) {
      throw new NotFoundException({
        message: ['Deportes no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { sports };
  }
}
