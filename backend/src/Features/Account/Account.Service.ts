import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { PasswordService } from '@App/Common/Helpers/Crypto.Helper.service';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { AccountModels } from './Account.Models';
import { AccountException } from '@App/Common/Exceptions/Account.Exception';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AccountService {
  Config: Config;

  constructor(
    private appConfig: AppConfig,
    private JwtService: JwtService,
    private usersService: UsersService,
    private passwordService: PasswordService,
  ) {
    this.Config = this.appConfig.Config!;
  }

  async Signin(
    email: string,
    password: string,
  ): Promise<AccountModels.SigninResModel> {
    const user: User | null = await this.usersService.findByEmail(email);
    const signinResult = await this.CanSignIn(user, password);
    if (!signinResult.Success) {
      throw new AccountException(signinResult.ErrorMsg);
    }
    const accessToken = await this.GetAccessToken(user!);
    const refreshToken = this.GetRefreshToken(user!);
    const currentUser = this.GetCurrentUser(user!);
    return new AccountModels.SigninResModel(
      accessToken,
      refreshToken,
      currentUser,
    );
  }

  async Signup(
    signupReqModel: AccountModels.SignupReqModel,
  ): Promise<AccountModels.SigninResModel> {
    let user = await this.usersService.findByEmail(signupReqModel.Email);
    const SignupResult = this.CanSignup(user);
    if (!SignupResult.Success) {
      throw new AccountException(SignupResult.ErrorMsg);
    }
    const hashedPassword = await this.passwordService.hashPassword(
      signupReqModel.Password,
    );

    user = await this.usersService.create({
      email: signupReqModel.Email,
      name: signupReqModel.Name,
      password: hashedPassword,
    });

    const accessToken = await this.GetAccessToken(user);
    const refreshToken = this.GetRefreshToken(user);
    const currentUser = this.GetCurrentUser(user);
    return new AccountModels.SigninResModel(
      accessToken,
      refreshToken,
      currentUser,
    );
  }

  async RefreshAccessToken(
    model: AccountModels.RefreshTokenReqModel,
  ): Promise<AccountModels.RefreshTokenResModel> {
    const user = await this.usersService.findByEmail(model.Email);
    if (!user) {
      throw new AccountException(ErrorCodesEnum.USER_NOT_FOUND);
    }
    // check if the saved refreshtoken is the same as in the request
    // if not then revoke all sessions

    const accessToken = await this.GetAccessToken(user);
    const refreshToken = this.GetRefreshToken(user);
    const currentUser = this.GetCurrentUser(user);

    return new AccountModels.RefreshTokenResModel(
      accessToken,
      refreshToken,
      currentUser,
    );
  }

  async CanSignIn(user: User | null, password: string) {
    if (user == null) {
      return {
        Success: false,
        ErrorMsg: ErrorCodesEnum.USER_NOT_FOUND,
      };
    }
    const PasswordMatched = await this.passwordService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!PasswordMatched) {
      return {
        Success: false,
        ErrorMsg: ErrorCodesEnum.WRONG_PASSWORD,
      };
    }

    return {
      Success: true,
      ErrorMsg: null,
    };
  }

  CanSignup(user: User | null) {
    if (user == null) {
      return {
        Success: true,
        ErrorMsg: null,
      };
    } else {
      return {
        Success: false,
        ErrorMsg: ErrorCodesEnum.USER_ALREADY_EXISTS,
      };
    }
  }

  async GetAccessToken(user: User): Promise<string> {
    const accessToken = this.JwtService.sign({
      Email: user.email,
    } as AccountModels.JwtModel);
    return accessToken;
  }

  GetRefreshToken(user: User): string {
    const refreshToken = this.JwtService.sign(
      {
        Email: user.email,
      } as AccountModels.JwtModel,
      {
        expiresIn: this.Config.Auth.Jwt.RefreshTokenLifeSpan as any,
      },
    );
    // I should add this refresh token to the contact in db
    // so every user should have a valid refresh token with him
    // then revoke on logout or on malicious activity or (with new signins implicitly as well)
    return refreshToken;
  }

  GetCurrentUser(user: User): AccountModels.CurrentUser {
    const currentUser = {
      Name: user.name,
      Email: user.email,
    } as AccountModels.CurrentUser;
    return currentUser;
  }
}
