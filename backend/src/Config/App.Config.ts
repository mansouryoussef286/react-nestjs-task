import { Inject, Injectable } from '@nestjs/common';
import Configuration from '@App/Config/Configuration';
import type { ConfigType } from '@nestjs/config';

export interface Config {
  Env: string;
  Server: {
    Host: string;
    Port: number;
    FrontEndHost: string;
  };
  Database: {
    Uri: string;
    name: string;
  };
  Auth: {
    Jwt: {
      Key: string;
      Lifespan: string;
      RefreshTokenLifeSpan: string;
      Issuer: string;
      Audience: string;
    };
  };
  Logging: {
    Endpoints: {
      LogRequests: boolean;
      Folder: string;
    };
    InvalidSignins: {
      LogRequests: boolean;
      Folder: string;
    };
    Exceptions: {
      LogRequests: boolean;
      Folder: string;
    };
  };
}

@Injectable()
export class AppConfig {
  constructor(
    @Inject(Configuration.KEY)
    public Config: ConfigType<typeof Configuration>,
  ) {}
}
