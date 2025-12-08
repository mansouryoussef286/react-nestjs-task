import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export namespace AccountModels {
  export class CurrentUser {
    Name!: string;
    Email!: string;
  }

  export class JwtModel {
    Email!: string;
  }

  export class SigninReqModel {
    @ApiProperty()
    Email!: string;
    @ApiProperty()
    Password!: string;
  }

  export class SignupReqModel {
    @IsEmail()
    @ApiProperty()
    Email!: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    Name: string;

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
    Password!: string;
  }

  export class SigninResModel {
    constructor(
      public AccessToken: string,
      public RefreshToken: string,
      public CurrentUser: CurrentUser,
    ) {}
  }

  export class SignupResModel {
    constructor(
      public AccessToken: string,
      public RefreshToken: string,
      public CurrentUser: CurrentUser,
    ) {}
  }
}
