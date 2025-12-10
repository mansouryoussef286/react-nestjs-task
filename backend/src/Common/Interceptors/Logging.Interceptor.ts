import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../Logging/Logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly LoggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('<Logging.Interceptor>');

    const request = context.switchToHttp().getRequest();
    request.StartTime = Date.now(); // to use in logging errors

    return next.handle().pipe(
      tap(() => {
        console.log(`After... ${Date.now() - request.StartTime}ms`);
        console.log('</Logging.Interceptor>');
        this.LoggingService.EndPoint(request);
      }),
    );
  }
}
