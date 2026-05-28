import { Controller, Post, Body, Req, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { JournalService } from '../services/journal.service';
import { CreateJournalEntryDto } from '../dto/create-entry.dto';
import { UpdateJournalEntryDto } from '../dto/update-entry.dto';
import { CreateTagDto } from '../dto/create-tag.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateMoodDto } from '../dto/create-mood.dto';

@Controller('journal')
export class JournalController {
  constructor(private readonly service: JournalService) {}

  @Post('entries')
  createEntry(@Req() req: any, @Body() body: CreateJournalEntryDto) {
    return this.service.createEntry(req.user.id, body as any);
  }

  @Get('entries')
  listEntries(@Req() req: any, @Query('cursor') cursor?: string, @Query('take') take = '20') {
    return this.service.listEntries(req.user.id, cursor, Number(take));
  }

  @Get('entries/:id')
  getEntry(@Req() req: any, @Param('id') id: string) {
    return this.service.getEntry(req.user.id, id);
  }

  @Patch('entries/:id')
  updateEntry(@Req() req: any, @Param('id') id: string, @Body() body: UpdateJournalEntryDto) {
    return this.service.updateEntry(req.user.id, id, body as any);
  }

  @Delete('entries/:id')
  deleteEntry(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteEntry(req.user.id, id);
  }

  // tags
  @Post('tags')
  createTag(@Req() req: any, @Body() body: CreateTagDto) {
    return this.service.createTag(req.user.id, body.name);
  }

  @Get('tags')
  listTags(@Req() req: any) {
    return this.service.listTags(req.user.id);
  }

  // categories
  @Post('categories')
  createCategory(@Req() req: any, @Body() body: CreateCategoryDto) {
    return this.service.createCategory(req.user.id, body as any);
  }

  @Get('categories')
  listCategories(@Req() req: any) {
    return this.service.listCategories(req.user.id);
  }

  // moods
  @Post('moods')
  createMood(@Req() req: any, @Body() body: CreateMoodDto) {
    return this.service.createMood(req.user.id, body as any);
  }

  // search
  @Get('search')
  search(@Req() req: any, @Query('q') q: string) {
    return this.service.searchEntries(req.user.id, q);
  }

  @Post('summaries')
  upsertSummary(@Req() req: any, @Body() body: { date: string; metrics: any }) {
    return this.service.upsertSummary(req.user.id, body.date, body.metrics);
  }
}

export default JournalController;
