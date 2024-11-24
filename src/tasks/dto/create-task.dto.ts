import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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
}
