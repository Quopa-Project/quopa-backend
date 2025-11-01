import { RegisterUserDto } from '../../users/dto/register-user.dto';
import {IsNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {CreateBranchDto} from "./create-branch.dto";

export class CreateUserBranchDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio.' })
  @ValidateNested({ each: true, message: 'El usuario debe ser válido.' })
  @Type(() => RegisterUserDto)
  @ApiProperty({ type: () => RegisterUserDto })
  user: RegisterUserDto;

  @IsNotEmpty({ message: 'La sucursal es obligatoria.' })
  @ValidateNested({ each: true, message: 'La sucursal debe ser válida.' })
  @Type(() => CreateBranchDto)
  @ApiProperty({ type: () => CreateBranchDto })
  branch: CreateBranchDto;
}