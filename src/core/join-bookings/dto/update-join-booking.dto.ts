import {IsBoolean, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from "class-transformer";
import {JoinBookingStatus} from "../entity/join-booking.entity";

export class UpdateJoinBookingDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El campo de pagado es obligatorio.' })
  @IsBoolean({ message: 'El campo de pagado debe ser verdadero o falso.' })
  @Type(() => Boolean)
  @ApiProperty({ example: true })
  isPayed: boolean;

  @IsOptional()
  @IsEnum(JoinBookingStatus, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: JoinBookingStatus, example: JoinBookingStatus.CONFIRMED })
  status: JoinBookingStatus;
}
