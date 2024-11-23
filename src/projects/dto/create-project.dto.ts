import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
