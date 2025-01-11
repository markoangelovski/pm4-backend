import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { endOfMonth, startOfMonth } from 'date-fns';
import { makeDate } from '../utils';

@Injectable()
export class ParseLimitOffsetPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      if (metadata.data === 'limit') return 50;
      if (metadata.data === 'offset') return 0;
      return 0;
    }
    return Math.abs(parsedValue);
  }
}

@Injectable()
export class ParseDayFormatPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (metadata.data === 'start' && !value)
      return makeDate(startOfMonth(new Date()).toISOString());
    if (metadata.data === 'end' && !value)
      return makeDate(endOfMonth(new Date()).toISOString());

    if (!value) return makeDate(new Date().toISOString());
    return makeDate(value);
  }
}
