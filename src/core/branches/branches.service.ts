import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Branch} from "./entity/branches.entity";
import {User} from "../users/entity/users.entity";

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}



  async findByCompanyId(companyId: number) {
    const branches = await this.branchRepository.findBy({
      company: { id: companyId }
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
}
