import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {CourtsService} from "./courts.service";
import {CreateCourtDto} from "./dto/create-court.dto";
import {UpdateCourtDto} from "./dto/update-court.dto";

@Controller('courts')
export class CourtsController {

  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  getAll() {
    return this.courtsService.findAll();
  }

  @Get('branch/:id')
  getCourtByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.courtsService.findByBranchId(id);
  }

  @Get('sport/:id')
  getCourtBySportId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.courtsService.findBySportId(id);
  }

  @Get(':id')
  getCourtById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.courtsService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtsService.updateById(id, updateCourtDto);
  }
}
