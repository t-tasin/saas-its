import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class HealthController {
  @Public()
  @Get('/health')
  check() {
    return { ok: true };
  }
}

