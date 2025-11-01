import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "./entity/companies.entity";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {User, UserRole} from "../users/entity/users.entity";

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const user = await this.userRepository.findOneBy({
      id: createCompanyDto.userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException({
        message: ['Solo los usuarios administradores pueden tener compañías.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCompany = this.companyRepository.create({
      name: createCompanyDto.name,
      user: user
    });
    const savedCompany = await this.companyRepository.save(newCompany);

    return { company: savedCompany };
  }

  async findByUserId(userId: number) {
    const company = await this.companyRepository.findOneBy({
      user: { id: userId }
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Compañía no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { company };
  }
}
