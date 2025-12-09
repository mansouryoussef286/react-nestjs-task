import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { AccountModels } from '../../Features/Account/Account.Models';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private readonly AsyncLocalStorage: AsyncLocalStorage<AccountModels.JwtModel>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log(request.user);

    this.AsyncLocalStorage.enterWith({
      ...request.user,
    });
    return next.handle();
  }
}
