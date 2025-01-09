import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isUUID } from 'class-validator';

// Custom Validator for taskId
@ValidatorConstraint({ async: false })
class IsUuidOrEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value === '' || isUUID(value);
  }

  defaultMessage(): string {
    return 'taskId must be a UUID or an empty string';
  }
}

function IsUuidOrEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUuidOrEmptyConstraint,
    });
  };
}

// Updated CreateEventDto
export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsDateString()
  day: string;

  @IsOptional()
  @IsUuidOrEmpty({ message: 'taskId must be a UUID or an empty string' })
  taskId: string;

  @IsOptional()
  logTitle: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
