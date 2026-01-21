import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, MoreThanOrEqual} from "typeorm";
import {Occupancy} from "./entity/occupancy.entity";
import {OccupancyType} from "../occupancy-types/entity/occupancy-type.entity";
import {Court} from "../courts/entity/courts.entity";
import {CreateOccupancyDto} from "./dto/create-occupancy.dto";

@Injectable()
export class OccupanciesService {

  constructor(
    @InjectRepository(Occupancy)
    private occupancyRepository: Repository<Occupancy>,
    @InjectRepository(OccupancyType)
    private occupancyTypeRepository: Repository<OccupancyType>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>
  ) {}

  async create(createOccupancyDto: CreateOccupancyDto) {
    const court = await this.courtRepository.findOneBy({
      id: createOccupancyDto.courtId
    });
    if (!court) {
      throw new NotFoundException({
        message: ['Cancha no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const occupancyType = await this.occupancyTypeRepository.findOneBy({
      id: createOccupancyDto.occupancyTypeId
    });
    if (!occupancyType) {
      throw new BadRequestException({
        message: ['Tipo de ocupación no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newOccupancy = this.occupancyRepository.create({
      title: createOccupancyDto.title,
      startDate: createOccupancyDto.startDate,
      endDate: createOccupancyDto.endDate,
      startTime: createOccupancyDto.startTime,
      endTime: createOccupancyDto.endTime,
      days: createOccupancyDto.days,
      court: court,
      occupancyType: occupancyType,
    });
    const savedOccupancy = await this.occupancyRepository.save(newOccupancy);

    return { occupancy: savedOccupancy };
  }

  async findByCourtIdAndActive(courtId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const occupancies = await this.occupancyRepository.find({
      where: { court: { id: courtId }, endDate: MoreThanOrEqual(today) },
      relations: ['occupancyType']
    });
    if (!occupancies.length) {
      throw new NotFoundException({
        message: ['Ocupaciones no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { occupancies };
  }
}
