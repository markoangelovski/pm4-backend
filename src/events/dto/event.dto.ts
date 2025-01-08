import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsDateString()
  day: string;
  @IsOptional()
  @IsUUID()
  taskId: string;
  @IsOptional()
  logTitle: string;
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
