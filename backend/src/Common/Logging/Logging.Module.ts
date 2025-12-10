import { Module } from '@nestjs/common';

import { AsyncLocalStorage } from 'async_hooks';
import { AppConfig } from '@App/Config/App.Config';
import { WinstonOptions, WinstonService } from './Winston.service';
import { WinstonModule } from 'nest-winston';
import { LOGGING_TOKEN, LoggingService } from './Logging.service';

@Module({
  imports: [WinstonModule.forRootAsync(WinstonOptions)],
  providers: [
    AppConfig,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    WinstonService,
    LoggingService,
    { provide: LOGGING_TOKEN, useClass: WinstonService }, // to be used in logging service and changed for multiple loggers
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
