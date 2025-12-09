import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Configuration from '@App/Config/Configuration';
import { mongooseOptions } from '@App/Data/mongoose.options';
import { AuthModule } from './Common/Auth/Auth.Module';
import { AccountModule } from './Features/Account/Account.Module';
import { CommonModule } from './Common/Common.Module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './Common/Interceptors/CurrentUser.Interceptor';

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
    AccountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class AppModule {}
