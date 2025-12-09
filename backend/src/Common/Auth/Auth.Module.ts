import { Module } from '@nestjs/common';

import { AppConfig } from '@App/Config/App.Config';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './Jwt.Helper';
import { JwtStrategy } from './Jwt.Strategy';
import { RefreshJwtStrategy } from './RefreshToken-Strategy';

@Module({
  imports: [
    {
      ...JwtModule.registerAsync(JwtOptions),
      global: true,
    },
  ],
  providers: [AppConfig, JwtStrategy, RefreshJwtStrategy],
  exports: [],
})
export class AuthModule {}
