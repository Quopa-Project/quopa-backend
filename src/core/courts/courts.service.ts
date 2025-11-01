import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Court } from "./entity/courts.entity";
import {Branch} from "../branches/entity/branches.entity";
import {CreateCourtDto} from "./dto/create-court.dto";
import {Sport} from "../sports/entity/sports.entity";

@Injectable()
export class CourtsService {

  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Sport)
    private sportRepository: Repository<Sport>
  ) {}

  async create(createCourtDto: CreateCourtDto) {
    const branch = await this.branchRepository.findOneBy({
      id: createCourtDto.branchId
    });
    if (!branch) {
      throw new BadRequestException({
        message: ['Sucursal no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const sport = await this.sportRepository.findOneBy({
      id: createCourtDto.sportId
    });
    if (!sport) {
      throw new BadRequestException({
        message: ['Deporte no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCourt = this.courtRepository.create({
      description: createCourtDto.description,
      capacity: createCourtDto.capacity,
      price: createCourtDto.price,
      branch: branch,
      sport: sport
    });
    const savedCourt = await this.courtRepository.save(newCourt);

    return { court: savedCourt };
  }
}
