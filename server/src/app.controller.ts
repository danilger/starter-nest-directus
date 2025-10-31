import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { UserAuthGuard } from './auth/guards/user_auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(UserAuthGuard, PermissionsGuard)
  getHello(): {message:string} {
    return this.appService.getHello();
  }
}
