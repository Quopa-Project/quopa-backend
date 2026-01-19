import {
  BadRequestException, Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put, Request, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {BranchesService} from "./branches.service";
import {CreateUserBranchDto} from "./dto/create-user-branch.dto";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('branches')
export class BranchesController {

  constructor(private readonly branchesService: BranchesService) {}

  @Post('user-branch')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUserAndBranch(@Body() createUserBranchDto: CreateUserBranchDto) {
    return this.branchesService.createUserAndBranch(createUserBranchDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyCompany(@Request() req: any) {
    return this.branchesService.findByUserId(req.user.id);
  }

  @Get('company/:id')
  getBranchByCompanyId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findByCompanyId(id);
  }

  @Get(':id')
  getBranchById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.updateById(id, updateBranchDto);
  }
}
