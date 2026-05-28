import { Controller, Get, Query, Req } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('daily-summary')
  dailySummary(@Req() req: any, @Query('date') date?: string) {
    return this.svc.getDailySummary(req.user.id, date ? new Date(date) : undefined);
  }

  @Get('heatmap')
  heatmap(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.getHeatmap(req.user.id, from ? new Date(from) : undefined, to ? new Date(to) : undefined);
  }

  @Get('streaks')
  streaks(@Req() req: any) {
    return this.svc.getStreaks(req.user.id);
  }

  @Get('trends')
  trends(@Req() req: any, @Query('metric') metric?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.getTrends(req.user.id, metric ?? 'activity', from ? new Date(from) : undefined, to ? new Date(to) : undefined);
  }
}

export default AnalyticsController;
