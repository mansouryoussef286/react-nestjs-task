import { Config } from '@App/Config/App.Config';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongooseOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): MongooseModuleFactoryOptions => {
    const Config = configService.get<Config>('Config');
    return {
      uri: Config!.Database.Uri,
      dbName: Config!.Database.name,
      retryAttempts: 1,
      retryDelay: 1000,
    };
  },
  inject: [ConfigService],
};
