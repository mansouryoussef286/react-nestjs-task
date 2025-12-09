import { Module } from '@nestjs/common';
import { AppConfig } from '@App/Config/App.Config';
import { AccountController } from '@App/Features/Account/Account.Controller';
import { AccountService } from '@App/Features/Account/Account.Service';
import { CommonModule } from '@App/Common/Common.Module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [AccountController],
  providers: [AppConfig, AccountService],
})
export class AccountModule {}
