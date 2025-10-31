import {BadRequestException, Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import {BranchesService} from "./branches.service";

@Controller('branches')
export class BranchesController {

  constructor(private readonly branchesService: BranchesService) {}



  @Get('company/:id')
  getBranchByCompanyId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findByCompanyId(id);
  }
}
