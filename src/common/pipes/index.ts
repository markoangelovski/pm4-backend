import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { format } from 'date-fns';

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
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) return format(new Date(), 'yyyy-MM-dd');
    return format(new Date(value), 'yyyy-MM-dd');
  }
}
