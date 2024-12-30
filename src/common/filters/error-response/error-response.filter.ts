import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { error } from 'console';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // let message =
    //   exception instanceof HttpException
    //     ? exception.message
    //     : 'Internal server error';

    // const data =
    //   exception instanceof HttpException ? exception.getResponse() : exception;

    // Consistent error response structure
    const errorResponse = {
      limit: 1,
      offset: 0,
      totalResults: 0,
      results: [],
      hasErrors: true,
      errors: [
        {
          ...exception,
        },
      ],
    };

    console.error(
      new Date(),
      ctx.getRequest().method,
      ctx.getRequest().url,
      '\n',
      exception,
    );

    response.status(status).json(errorResponse);
  }
}
