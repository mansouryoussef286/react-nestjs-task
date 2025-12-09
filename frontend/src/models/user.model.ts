export class SigninResModel {
  accessToken!: string;
  refreshToken!: string;
  currentUser!: CurrentUser;
}

export class SignupResModel {
  accessToken!: string;
  refreshToken!: string;
  currentUser!: CurrentUser;
}

export class CurrentUser {
  name!: string;
  email!: string;
}
