import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Response<T> {
  limit: number;
  offset: number;
  totalResults: number;
  results: T[];
  hasErrors: boolean;
  errors: any[];
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data.results) data = { ...data, results: [] };
        const results = Array.isArray(data.results)
          ? data.results
          : [data.results];

        console.log(
          new Date(),
          context.getArgByIndex(0).method,
          context.getArgByIndex(0).url,
          '\n',
          process.env.NODE_ENV !== 'production' ? data : '',
        );

        return {
          limit: data.limit || 1,
          offset: data.offset || 0,
          totalResults: data.totalResults || results.length,
          results,
          hasErrors: false,
          errors: [],
        };
      }),
    );
  }
}
