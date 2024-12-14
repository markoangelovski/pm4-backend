import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @IsNotEmpty()
  title: string;
  // @IsNotEmpty()
  @IsDateString()
  day: string;
  // @IsNotEmpty()
  @IsUUID()
  taskId: string;
  @IsNotEmpty()
  logTitle: string;
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
