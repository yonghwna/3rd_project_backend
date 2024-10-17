import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id/:category')
  getHello(): string {
    return this.appService.getHello();
  }
}
