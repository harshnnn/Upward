import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { BodyMetricsService } from '../services/body-metrics.service';
import { CreateBodyMetricDto } from '../dto/create-body-metric.dto';

@Controller('body-metrics')
export class BodyMetricsController {
  constructor(private readonly svc: BodyMetricsService) {}

  @Post()
  create(@Req() req: any, @Body() body: CreateBodyMetricDto) {
    return this.svc.create(req.user.id, body as any);
  }

  @Get()
  list(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.list(req.user.id, from, to);
  }
}

export default BodyMetricsController;
