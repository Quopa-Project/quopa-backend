import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {Branch} from "./entity/branches.entity";
import {User, UserRole} from "../users/entity/users.entity";
import {CreateUserBranchDto} from "./dto/create-user-branch.dto";
import * as bcrypt from "bcrypt";
import {Company} from "../companies/entity/companies.entity";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private dataSource: DataSource
  ) {}

  async createUserAndBranch(createUserBranchDto: CreateUserBranchDto) {
    const userExisting = await this.userRepository.findOneBy({
      email: createUserBranchDto.user.email
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Email ya está en uso.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(createUserBranchDto.user.password, 10);

    const company = await this.companyRepository.findOneBy({
      id: createUserBranchDto.branch.companyId
    });
    if (!company) {
      throw new BadRequestException({
        message: ['Compañía no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const savedBranch = await this.dataSource.transaction(async manager => {
      const userRepository = manager.getRepository(User);
      const branchRepository = manager.getRepository(Branch);

      const newUser = userRepository.create({
        ...createUserBranchDto.user,
        password: hashedPassword,
        role: UserRole.BRANCH,
        tokenVersion: 1
      });
      const savedUser = await userRepository.save(newUser);

      const newBranch = branchRepository.create({
        ...createUserBranchDto.branch,
        user: savedUser,
        company: company
      });
      return await branchRepository.save(newBranch);
    });
    return { branch: savedBranch };
  }

  async findByUserId(userId: number) {
    const branch = await this.branchRepository.findOneBy({
      user: { id: userId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }

  async findByCompanyId(companyId: number) {
    const branches = await this.branchRepository.find({
      where: { company: { id: companyId } },
      relations: ['company']
    });
    if (!branches.length) {
      throw new NotFoundException({
        message: ['Sucursales no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branches };
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['company', 'user']
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }

  async updateById(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.findOneBy({
      id
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sucursal no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.branchRepository.update(id, updateBranchDto);

    return this.findById(id);
  }
}
