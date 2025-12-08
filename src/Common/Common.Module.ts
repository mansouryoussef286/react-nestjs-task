import { Module } from '@nestjs/common';

import { AppConfig } from '@App/Config/App.Config';
import { PasswordService } from './Helpers/Crypto.Helper.service';

@Module({
  providers: [AppConfig, PasswordService],
  exports: [PasswordService],
})
export class CommonModule {}
