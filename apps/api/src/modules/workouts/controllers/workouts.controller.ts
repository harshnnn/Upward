import { Controller, Post, Body, Get, Query, Param, Patch, Delete, Req } from '@nestjs/common';
import { WorkoutsService } from '../services/workouts.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';
import { CreateSessionDto } from '../dto/create-session.dto';
import { LogSetDto } from '../dto/log-set.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly svc: WorkoutsService) {}

  // Exercises
  @Post('exercises')
  createExercise(@Req() req: any, @Body() body: CreateExerciseDto) {
    return this.svc.createExercise(req.user.id, body as any);
  }

  @Get('exercises')
  listExercises(@Req() req: any, @Query('q') q?: string, @Query('category') category?: string) {
    return this.svc.listExercises(req.user.id, q ?? undefined, category ?? undefined);
  }

  @Get('exercises/:id')
  getExercise(@Req() req: any, @Param('id') id: string) {
    return this.svc.getExercise(req.user.id, id);
  }

  @Patch('exercises/:id')
  updateExercise(@Req() req: any, @Param('id') id: string, @Body() body: UpdateExerciseDto) {
    return this.svc.updateExercise(req.user.id, id, body as any);
  }

  // Sessions
  @Post('sessions')
  createSession(@Req() req: any, @Body() body: CreateSessionDto) {
    return this.svc.createSession(req.user.id, body as any);
  }

  @Get('sessions')
  listSessions(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.listSessions(req.user.id, from, to);
  }

  @Get('sessions/:id')
  getSession(@Req() req: any, @Param('id') id: string) {
    return this.svc.getSession(req.user.id, id);
  }

  @Post('sessions/:id/exercises/:exerciseLogId/sets')
  logSet(@Req() req: any, @Param('id') sessionId: string, @Param('exerciseLogId') exerciseLogId: string, @Body() body: LogSetDto) {
    return this.svc.logSet(req.user.id, sessionId, exerciseLogId, body as any);
  }

  @Get('prs')
  listPRs(@Req() req: any) {
    return this.svc.listPRs(req.user.id);
  }
}

export default WorkoutsController;
