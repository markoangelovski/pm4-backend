import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

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
