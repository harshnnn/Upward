import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { NutritionService } from '../services/nutrition.service';
import { CreateNutritionDto } from '../dto/create-nutrition.dto';

@Controller('nutrition')
export class NutritionController {
  constructor(private readonly svc: NutritionService) {}

  @Post('logs')
  createLog(@Req() req: any, @Body() body: CreateNutritionDto) {
    return this.svc.createLog(req.user.id, body as any);
  }

  @Get('logs')
  listLogs(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.listLogs(req.user.id, from, to);
  }
}

export default NutritionController;
