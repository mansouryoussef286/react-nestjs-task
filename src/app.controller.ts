import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './Common/Auth/Authenticated.Guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @Get('private-info')
  @UseGuards(AuthenticatedGuard)
  getPrivateInfo(): string {
    return this.appService.getPrivateInfo();
  }
}
