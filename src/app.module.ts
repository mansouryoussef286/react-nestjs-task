import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Configuration from '@App/Config/Configuration';
import { mongooseOptions } from '@App/Data/mongoose.options';
import { AccountModule } from './Features/Account/Account.Module';
import { JwtOptions } from './Common/Auth/Jwt.Helper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync(mongooseOptions),
    {
      ...JwtModule.registerAsync(JwtOptions),
      global: true,
    },
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
