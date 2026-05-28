import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): { status: string } {
    return this.healthService.getHealth();
  }

  @Get('ready')
  getReadiness(): { status: string } {
    return this.healthService.getReadiness();
  }
}
