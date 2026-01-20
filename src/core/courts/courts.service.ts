import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Court } from "./entity/courts.entity";
import {Branch} from "../branches/entity/branches.entity";
import {CreateCourtDto} from "./dto/create-court.dto";
import {Sport} from "../sports/entity/sports.entity";
import {UpdateCourtDto} from "./dto/update-court.dto";

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

  async findByBranchId(branchId: number) {
    const courts = await this.courtRepository.find({
      where: { branch: { id: branchId } },
      relations: ['branch', 'sport']
    });
    if (!courts.length) {
      throw new NotFoundException({
        message: ['Canchas no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { courts };
  }

  async findAll() {
    const courts = await this.courtRepository.find({
      relations: ['branch', 'sport']
    });
    if (!courts.length) {
      throw new NotFoundException({
        message: ['Canchas no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { courts };
  }

  async findById(id: number) {
    const court = await this.courtRepository.findOne({
      where: { id },
      relations: ['branch', 'sport']
    });
    if (!court) {
      throw new NotFoundException({
        message: ['Cancha no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { court };
  }

  async updateById(id: number, updateCourtDto: UpdateCourtDto) {
    const court = await this.courtRepository.findOneBy({
      id
    });
    if (!court) {
      throw new NotFoundException({
        message: ['Cancha no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.courtRepository.update(id, updateCourtDto);

    return this.findById(id);
  }
}
