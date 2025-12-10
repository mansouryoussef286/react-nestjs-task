import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AccountException } from '../Exceptions/Account.Exception';
import { LoggingService } from '../Logging/Logging.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly LoggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const message = exception.message;
    const startTime = request.StartTime ?? Date.now();

    console.log(exception.name, '\n', exception);
    if (exception instanceof AccountException) {
      this.LoggingService.SigninError(request, startTime, message);
    } else {
      // log any error other than login errors
      this.LoggingService.Exceptions(request, startTime, exception);
    }

    //return the error to user as is
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      return response
        .status(status)
        .json({ statusCode: status, message: errorResponse });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
