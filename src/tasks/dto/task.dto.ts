import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';

enum TaskStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  pl?: string;

  @IsOptional()
  @IsString()
  jiraLink?: string;

  @IsOptional()
  @Type(() => Date) // Automatically converts string to Date
  dueDate?: Date;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

// Makes all fields optional
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
