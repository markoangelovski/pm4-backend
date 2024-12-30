import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  pl?: string;
}

// Makes all fields optional
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
