import { RegisterUserDto } from '../../users/dto/register-user.dto';
import {IsNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {CreateCompanyDto} from "./create-company.dto";

export class CreateUserCompanyDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio.' })
  @ValidateNested({ each: true, message: 'El usuario debe ser válido.' })
  @Type(() => RegisterUserDto)
  @ApiProperty({ type: () => RegisterUserDto })
  user: RegisterUserDto;

  @IsNotEmpty({ message: 'La compañía es obligatoria.' })
  @ValidateNested({ each: true, message: 'La compañía debe ser válida.' })
  @Type(() => CreateCompanyDto)
  @ApiProperty({ type: () => CreateCompanyDto })
  company: CreateCompanyDto;
}