import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty()
  @IsUUID()  eventId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

