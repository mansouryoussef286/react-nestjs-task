import { Config } from '@App/Config/App.Config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const Config = configService.get<Config>('Config');
    return {
      secret: Config!.Auth.Jwt.Key,
      signOptions: {
        expiresIn: Config!.Auth.Jwt.Lifespan as any,
        issuer: Config!.Auth.Jwt.Issuer,
        audience: Config!.Auth.Jwt.Audience,
      },
    };
  },
  inject: [ConfigService],
};
