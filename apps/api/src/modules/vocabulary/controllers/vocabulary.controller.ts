import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Req } from '@nestjs/common';
import { VocabularyService } from '../services/vocabulary.service';
import { CreateWordDto } from '../dto/create-word.dto';
import { UpdateWordDto } from '../dto/update-word.dto';
import { CreateMeaningDto } from '../dto/create-meaning.dto';
import { CreateSentenceDto } from '../dto/create-sentence.dto';
import { ScheduleRevisionDto } from '../dto/schedule-revision.dto';
import { ReviewEventDto } from '../dto/review-event.dto';

@Controller('vocab')
export class VocabularyController {
  constructor(private readonly svc: VocabularyService) {}

  @Post('words')
  createWord(@Req() req: any, @Body() body: CreateWordDto) {
    return this.svc.createWord(req.user.id, body as any);
  }

  @Get('words')
  listWords(@Req() req: any, @Query('q') q?: string, @Query('lang') lang?: string, @Query('category') category?: string) {
    return this.svc.listWords(req.user.id, q ?? undefined, lang ?? undefined, category ?? undefined);
  }

  @Get('words/:id')
  getWord(@Req() req: any, @Param('id') id: string) {
    return this.svc.getWord(req.user.id, id);
  }

  @Patch('words/:id')
  updateWord(@Req() req: any, @Param('id') id: string, @Body() body: UpdateWordDto) {
    return this.svc.updateWord(req.user.id, id, body as any);
  }

  @Delete('words/:id')
  deleteWord(@Req() req: any, @Param('id') id: string) {
    return this.svc.deleteWord(req.user.id, id);
  }

  @Post('words/:id/meanings')
  addMeaning(@Req() req: any, @Param('id') id: string, @Body() body: CreateMeaningDto) {
    return this.svc.addMeaning(req.user.id, id, body as any);
  }

  @Post('words/:id/sentences')
  addSentence(@Req() req: any, @Param('id') id: string, @Body() body: CreateSentenceDto) {
    return this.svc.addSentence(req.user.id, id, body as any);
  }

  @Post('revisions')
  scheduleRevision(@Req() req: any, @Body() body: ScheduleRevisionDto) {
    return this.svc.scheduleRevision(req.user.id, body as any);
  }

  @Get('revisions')
  listRevisions(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.listRevisions(req.user.id, from, to);
  }

  @Post('review')
  recordReview(@Req() req: any, @Body() body: ReviewEventDto) {
    return this.svc.recordReviewEvent(req.user.id, body as any);
  }

  @Get('summaries')
  getSummaries(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.getSummaries(req.user.id, from, to);
  }
}

export default VocabularyController;
