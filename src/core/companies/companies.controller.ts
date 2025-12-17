import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {CompaniesService} from "./companies.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {UpdateCompanyDto} from "./dto/update-company.dto";
import {CreateUserCompanyDto} from "./dto/create-user-company.dto";

@Controller('companies')
export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService) {}

  @Post('user-company')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createUserAndCompany(@Body() createUserCompanyDto: CreateUserCompanyDto) {
    return this.companiesService.createUserAndCompany(createUserCompanyDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyCompany(@Request() req: any) {
    return this.companiesService.findByUserId(req.user.id);
  }

  @Get()
  getAll() {
    return this.companiesService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.updateById(id, updateCompanyDto);
  }
}
