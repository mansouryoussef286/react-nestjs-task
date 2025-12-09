import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AccountService } from '@App/Features/Account/Account.Service';
import { AccountModels } from './Account.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private AccountService: AccountService) {}

  @Post('signin')
  @ApiBody({ type: AccountModels.SigninReqModel })
  Signin(
    @Body() SigninReqModel: AccountModels.SigninReqModel,
  ): Promise<AccountModels.SigninResModel> {
    return this.AccountService.Signin(
      SigninReqModel.email,
      SigninReqModel.password,
    );
  }

  @Post('signup')
  @ApiBody({ type: AccountModels.SignupReqModel })
  Signup(
    @Body() SignupReqModel: AccountModels.SignupReqModel,
  ): Promise<AccountModels.SignupResModel> {
    return this.AccountService.Signup(SignupReqModel);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBody({ type: AccountModels.RefreshTokenReqModel })
  refreshToken(
    @Body() RefreshTokenReqModel: AccountModels.RefreshTokenReqModel,
  ): Promise<AccountModels.RefreshTokenResModel> {
    return this.AccountService.RefreshAccessToken(RefreshTokenReqModel);
  }
}
