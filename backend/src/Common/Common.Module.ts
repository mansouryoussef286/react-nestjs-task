import { Module } from '@nestjs/common';

import { AsyncLocalStorage } from 'async_hooks';
import { AppConfig } from '@App/Config/App.Config';
import { UserHelper } from './Helpers/CurrentUser.Helper.service';
import { PasswordService } from './Helpers/Crypto.Helper.service';
import { ThrottlingModule } from './Throttling/Throttling.Module';

@Module({
  imports: [AsyncLocalStorage, ThrottlingModule],
  providers: [
    AppConfig,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    UserHelper,
    PasswordService,
  ],
  exports: [UserHelper, AsyncLocalStorage, PasswordService],
})
export class CommonModule {}
