import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AccountService } from '@App/Features/Account/Account.Service';
import { AccountModels } from './Account.Models';

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
      SigninReqModel.Email,
      SigninReqModel.Password,
    );
  }

  @Post('signup')
  @ApiBody({ type: AccountModels.SignupReqModel })
  Signup(
    @Body() SignupReqModel: AccountModels.SignupReqModel,
  ): Promise<AccountModels.SignupResModel> {
    return this.AccountService.Signup(SignupReqModel);
  }
}
