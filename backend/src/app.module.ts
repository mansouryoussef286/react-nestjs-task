import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Configuration from '@App/Config/Configuration';
import { mongooseOptions } from '@App/Data/mongoose.options';
import { AuthModule } from '@App/Common/Auth/Auth.Module';
import { AccountModule } from '@App/Features/Account/Account.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from '@App/Common/Interceptors/CurrentUser.Interceptor';
import { LoggingInterceptor } from './Common/Interceptors/Logging.Interceptor';
import { LoggingModule } from './Common/Logging/Logging.Module';
import { GlobalExceptionFilter } from './Common/Filters/GlobalException.Filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync(mongooseOptions),
    AuthModule,
    CommonModule,
    LoggingModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
