import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    // Standardize error message structure
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      error:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
    };

    // Custom handling for Rate Limit (429) errors
    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      const tier = (message as any).tier;
      if (tier === 'PREMIUM') {
        errorResponse.error =
          'You have exceeded your Premium API call limit (100 req/min). Please wait a moment before trying again.';
      } else {
        errorResponse.error =
          'Wait! You have exceeded your API call limit. Upgrade to Premium for 100 calls per minute.';
      }
    }

    response.status(status).json(errorResponse);

  }
}
