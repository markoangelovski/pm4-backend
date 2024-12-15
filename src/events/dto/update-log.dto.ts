import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class UpdateLogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
