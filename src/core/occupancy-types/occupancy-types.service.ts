import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {OccupancyType} from "./entity/occupancy-type.entity";
import {CreateOccupancyTypeDto} from "./dto/create-occupancy-type.dto";

@Injectable()
export class OccupancyTypesService {

  constructor(
    @InjectRepository(OccupancyType)
    private occupancyTypeRepository: Repository<OccupancyType>,
  ) {}

  async create(createOccupancyTypeDto: CreateOccupancyTypeDto) {
    const occupancyTypeExisting = await this.occupancyTypeRepository.findOneBy({
      name: createOccupancyTypeDto.name
    });
    if (occupancyTypeExisting) {
      throw new BadRequestException({
        message: ['Tipo de ocupación ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newOccupancyType = this.occupancyTypeRepository.create({
      name: createOccupancyTypeDto.name,
      icon: createOccupancyTypeDto.icon,
    });
    const savedOccupancyType = await this.occupancyTypeRepository.save(newOccupancyType);

    return { occupancyType: savedOccupancyType };
  }

  async findAll() {
    const occupancyTypes = await this.occupancyTypeRepository.find();
    if (!occupancyTypes.length) {
      throw new NotFoundException({
        message: ['Tipos de ocupaciones no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { occupancyTypes };
  }
}
