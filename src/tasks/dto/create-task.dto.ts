import { IsNotEmpty, IsOptional, IsUUID, IsDate, IsEnum, ValidateIf } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  pl?: string;

  @IsOptional()
  jiraLink?: string;

  @IsDate()
  dueDate: Date;

  @IsEnum(['upcoming', 'in-progress', 'completed'])
  status: 'upcoming' | 'in-progress' | 'completed';
}
