import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Req } from '@nestjs/common';
import { TrackingService } from '../services/tracking.service';
import { CreateTrackerDto } from '../dto/create-tracker.dto';
import { UpdateTrackerDto } from '../dto/update-tracker.dto';
import { CreateEntryDto } from '../dto/create-entry.dto';
import { UpdateEntryDto } from '../dto/update-entry.dto';
import { CreateGoalDto } from '../dto/create-goal.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  // Trackers
  @Post('trackers')
  createTracker(@Req() req: any, @Body() body: CreateTrackerDto) {
    return this.service.createTracker(req.user.id, body as any);
  }

  @Get('trackers')
  listTrackers(@Req() req: any, @Query('page') page = '1', @Query('perPage') perPage = '20') {
    return this.service.listTrackers(req.user.id, Number(page), Number(perPage));
  }

  @Get('trackers/:id')
  getTracker(@Req() req: any, @Param('id') id: string) {
    return this.service.getTracker(req.user.id, id);
  }

  @Patch('trackers/:id')
  updateTracker(@Req() req: any, @Param('id') id: string, @Body() body: UpdateTrackerDto) {
    return this.service.updateTracker(req.user.id, id, body as any);
  }

  @Delete('trackers/:id')
  deleteTracker(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteTracker(req.user.id, id);
  }

  // Entries
  @Post('entries')
  createEntry(@Req() req: any, @Body() body: CreateEntryDto) {
    return this.service.createEntry(req.user.id, body as any);
  }

  @Get('entries')
  listEntries(
    @Req() req: any,
    @Query('trackerId') trackerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '50'
  ) {
    return this.service.listEntries(req.user.id, trackerId, from, to, Number(page), Number(perPage));
  }

  @Patch('entries/:id')
  updateEntry(@Req() req: any, @Param('id') id: string, @Body() body: UpdateEntryDto) {
    return this.service.updateEntry(req.user.id, id, body as any);
  }

  @Delete('entries/:id')
  deleteEntry(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteEntry(req.user.id, id);
  }

  // Goals
  @Post('goals')
  createGoal(@Req() req: any, @Body() body: CreateGoalDto) {
    return this.service.createGoal(req.user.id, body as any);
  }

  @Get('goals')
  listGoals(@Req() req: any) {
    return this.service.listGoals(req.user.id);
  }

  // Summaries
  @Post('summaries')
  upsertSummary(@Req() req: any, @Body() body: { date: string; metrics: any }) {
    return this.service.upsertDailySummary(req.user.id, body.date, body.metrics);
  }
}

export default TrackingController;
