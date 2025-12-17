import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {Company} from "./entity/companies.entity";
import {User, UserRole} from "../users/entity/users.entity";
import {UpdateCompanyDto} from "./dto/update-company.dto";
import * as bcrypt from "bcrypt";
import {CreateUserCompanyDto} from "./dto/create-user-company.dto";

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async createUserAndCompany(createUserCompanyDto: CreateUserCompanyDto) {
    const userExisting = await this.userRepository.findOneBy({
      email: createUserCompanyDto.user.email
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Email ya está en uso.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(createUserCompanyDto.user.password, 10);

    const savedCompany = await this.dataSource.transaction(async manager => {
      const userRepository = manager.getRepository(User);
      const companyRepository = manager.getRepository(Company);

      const newUser = userRepository.create({
        ...createUserCompanyDto.user,
        password: hashedPassword,
        role: UserRole.ADMIN,
        tokenVersion: 1
      });
      const savedUser = await userRepository.save(newUser);

      const newCompany = companyRepository.create({
        ...createUserCompanyDto.company,
        user: savedUser
      });
      return await companyRepository.save(newCompany);
    });
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

  async findAll() {
    const companies = await this.companyRepository.find();
    if (!companies.length) {
      throw new NotFoundException({
        message: ['Compañías no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { companies };
  }

  async findById(id: number) {
    const company = await this.companyRepository.findOneBy({
      id
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

  async updateById(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOneBy({
      id
    });
    if (!company) {
      throw new NotFoundException({
        message: ['Compañía no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.companyRepository.update(id, updateCompanyDto);

    return this.findById(id);
  }
}
