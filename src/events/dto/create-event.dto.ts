import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class EventDto {
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsDateString()
  day: string;
  @IsOptional()
  @IsUUID()
  taskId: string;
  @IsNotEmpty()
  logTitle: string;
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}

export class CreateEventDto extends EventDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
