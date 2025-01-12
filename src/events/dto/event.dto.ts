import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isUUID } from 'class-validator';
import { makeDate } from 'src/common/utils';

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
  @Transform(({ value }) => makeDate(value))
  day: Date;

  @IsOptional()
  @IsUuidOrEmpty({ message: 'taskId must be a UUID or an empty string' })
  @Transform(({ value }) => (value ? value : null))
  taskId: string;

  @IsOptional()
  logTitle: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
