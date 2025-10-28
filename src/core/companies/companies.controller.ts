import {Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {CompaniesService} from "./companies.service";
import {CreateCompanyDto} from "./dto/create-company.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('companies')
export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyCompany(@Request() req: any) {
    return this.companiesService.findByUserId(req.user.id);
  }
}
