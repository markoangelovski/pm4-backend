import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    let data =
      exception instanceof HttpException
        ? exception.getResponse()
        : process.env.NODE_ENV === 'production'
          ? null
          : exception;

    // Consistent error response structure
    const errorResponse = {
      statusCode: status,
      message,
      hasErrors: true,
      data: Array.isArray(data) ? data : [data],
    };

    console.error(
      ctx.getRequest().method,
      ctx.getRequest().url,
      '\n',
      exception,
    );

    response.status(status).json(errorResponse);
  }
}
