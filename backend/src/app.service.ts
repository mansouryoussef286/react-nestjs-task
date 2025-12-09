import { Injectable } from '@nestjs/common';
import { UserHelper } from './Common/Helpers/CurrentUser.Helper.service';

@Injectable()
export class AppService {
  constructor(private UserHelper: UserHelper) {}

  getHello(): string {
    return 'Nestjs task api version **.**.**';
  }

  getPrivateInfo(): string {
    const currentUser = this.UserHelper.GetCurrentUser();
    return `This is private info only for user email ${currentUser.email}`;
  }
}
