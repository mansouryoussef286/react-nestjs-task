import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export namespace AccountModels {
  export class CurrentUser {
    name!: string;
    email!: string;
  }

  export class JwtModel {
    email!: string;
  }

  export class SigninReqModel {
    @IsEmail()
    @ApiProperty()
    email!: string;
    @MinLength(8)
    @ApiProperty()
    password!: string;
  }

  export class SignupReqModel {
    @IsEmail()
    @ApiProperty()
    email!: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    name!: string;

    @IsString()
    @MinLength(8)
    // at least one letter, one number, one special char
    @Matches(
      /(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+/,
      {
        message:
          'password too weak; use letters, numbers and special characters',
      },
    )
    @ApiProperty()
    password!: string;
  }

  export class RefreshTokenReqModel {
    @IsEmail()
    @ApiProperty()
    email!: string;

    @IsString()
    @ApiProperty()
    refreshToken!: string;
  }

  export class SigninResModel {
    constructor(
      public accessToken: string,
      public refreshToken: string,
      public currentUser: CurrentUser,
    ) {}
  }

  export class SignupResModel {
    constructor(
      public accessToken: string,
      public refreshToken: string,
      public currentUser: CurrentUser,
    ) {}
  }

  export class RefreshTokenResModel {
    constructor(
      public accessToken: string,
      public refreshToken: string,
      public currentUser: CurrentUser,
    ) {}
  }
}
