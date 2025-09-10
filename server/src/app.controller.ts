import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserAuthGuard } from './auth/guards/user_auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { Permissions } from './auth/decorators/permissions.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Permissions(['read pages'])
  @UseGuards(UserAuthGuard, PermissionsGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
