import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
@Controller()
export class AppController {
  @Get('/me')
  me(@Req() req: Request) { return { tenant: req.tenant ?? null }; }
}
