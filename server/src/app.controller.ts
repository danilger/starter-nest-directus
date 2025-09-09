import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JWTguard } from './auth/JWTguard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JWTguard)
  getHello(): string {
    return this.appService.getHello();
  }
}
