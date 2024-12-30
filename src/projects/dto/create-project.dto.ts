import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  // @IsNotEmpty()
  // @IsUUID()
  // userId: string;

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
