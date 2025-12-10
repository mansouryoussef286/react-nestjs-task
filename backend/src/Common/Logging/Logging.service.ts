import { Inject, Injectable } from '@nestjs/common';
import type { ILogging } from './ILogging.Interface';

export const LOGGING_TOKEN = 'LOGGING_TOKEN';

@Injectable()
export class LoggingService implements ILogging {
  constructor(@Inject(LOGGING_TOKEN) private readonly logger: ILogging) {}

  SigninError(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ) {
    return this.logger.SigninError(request, startTime, message, trace, context);
  }

  EndPoint(request: any, trace?: string, context?: string) {
    return this.logger.EndPoint(request, trace, context);
  }

  Exceptions(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ) {
    return this.logger.Exceptions(request, startTime, message, trace, context);
  }

  OnUnhandledExecptions(): void {
    this.logger.OnUnhandledExecptions();
  }
}
