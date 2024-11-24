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
      exception instanceof HttpException ? exception.getResponse() : null;

    // Consistent error response structure
    const errorResponse = {
      statusCode: status,
      message,
      hasErrors: true,
      data: Array.isArray(data) ? data : [data],
    };

    response.status(status).json(errorResponse);
  }
}
