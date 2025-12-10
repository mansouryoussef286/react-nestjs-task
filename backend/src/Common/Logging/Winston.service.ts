import { AppConfig, Config } from '@App/Config/App.Config';
import { Inject, Injectable } from '@nestjs/common';
import {
  WINSTON_MODULE_PROVIDER,
  WinstonModuleAsyncOptions,
} from 'nest-winston';
import * as winston from 'winston';
import { createLogger } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserHelper } from '../Helpers/CurrentUser.Helper.service';
import { ILogging } from './ILogging.Interface';

@Injectable()
export class WinstonService implements ILogging {
  private Config: Config;
  private InValidsigninLogger: winston.Logger;
  private EndPointLogger: winston.Logger;
  private CustomLogger: winston.Logger;
  private DataBaseLogger: winston.Logger;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger,
    private appConfig: AppConfig,
  ) {
    this.Config = this.appConfig.Config;
    this.CreateLoggers(); // creating the extra loggers
  }

  CreateLoggers() {
    this.Loggers.InvalidSignin();
    this.Loggers.EndPoints();
  }

  Loggers = {
    InvalidSignin: () => {
      this.InValidsigninLogger = createLogger({
        level: 'error',
        format: customFormatter,
        transports: [
          new DailyRotateFile({
            filename: `${this.Config.Logging.InvalidSignins.Folder}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            utc: true,
          }),
        ],
      });
    },
    EndPoints: () => {
      this.EndPointLogger = createLogger({
        level: 'info',
        format: customFormatter,
        transports: [
          new DailyRotateFile({
            filename: `${this.Config.Logging.Endpoints.Folder}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            utc: true,
          }),
        ],
      });
    },
  };

  SigninError(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.InValidsigninLogger.error({
        LogToken: request.headers['log-token'],
        EndpointUrl: request.url,
        Method: request.method,
        RemoteIp: request.connection.remoteAddress,
        Start: this.ParseDate(startTime),
        End: this.ParseDate(),
        Time: `${Date.now() - startTime}`,
        Error: message,
      });
    });
  }

  EndPoint(request: any, trace?: string, context?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.EndPointLogger.info({
        LogToken: request.headers['log-token'],
        EndpointUrl: request.url,
        Method: request.method,
        RemoteIp: request.connection.remoteAddress,
        UserId: request.user?.UserId, // ? due to no user in signin needs to be removed after account api signin
        Start: this.ParseDate(request.StartTime),
        End: this.ParseDate(),
        Time: `${Date.now() - request.StartTime}`,
      });
    });
  }

  Exceptions(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.error({
        LogToken: request.headers['log-token'],
        EndpointUrl: request.url,
        Method: request.method,
        RemoteIp: request.connection.remoteAddress,
        UserId: request.user?.UserId, // ? due to no user in signin needs to be removed after account api signin
        Start: this.ParseDate(startTime),
        End: this.ParseDate(),
        Time: `${Date.now() - startTime}`,
        Error: message,
      });
    });
  }

  OnUnhandledExecptions(): void {
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error({
        stack: promise,
        reason,
        Start: this.ParseDate(),
      });
    });
  }

  ParseDate(time?: number): string {
    time = time ?? Date.now();
    const parsedDate = new Date(time)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/Z/, '');
    return parsedDate;
  }
}

export const WinstonOptions: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const Config = configService.get<Config>('Config')!;
    return {
      format: customFormatter,
      transports: [
        // all errors
        new DailyRotateFile({
          level: 'error',
          dirname: `${Config.Logging.Exceptions.Folder}`,
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          utc: true,
        }),
      ],
    };
  },
  inject: [ConfigService],
};
export const customFormatter = winston.format.printf((info: any) => {
  const { message, ...rest } = info;
  const logMessage = {
    ...message,
  };
  return JSON.stringify(logMessage);
});
