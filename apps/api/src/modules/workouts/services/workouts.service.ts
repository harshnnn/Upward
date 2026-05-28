import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutsRepository } from '../repositories/workouts.repository';
import { JobsService } from '../../jobs/jobs.service';

@Injectable()
export class WorkoutsService {
  constructor(private readonly repo: WorkoutsRepository, private readonly jobs: JobsService) {}

  // Exercises
  async createExercise(userId: string, payload: any) {
    const data = { userId, name: payload.name, description: payload.description ?? null, categoryId: payload.categoryId ?? null, type: payload.type ?? 'STRENGTH', defaultUnit: payload.defaultUnit ?? 'KG', metadata: payload.metadata ?? {} };
    return this.repo.createExercise(data as any);
  }

  async listExercises(userId: string, q?: string, category?: string) {
    return this.repo.findExercises(userId, q, category);
  }

  async getExercise(userId: string, id: string) {
    const ex = await this.repo.findExerciseById(id);
    if (!ex) throw new NotFoundException('Exercise not found');
    if (ex.userId && ex.userId !== userId) throw new NotFoundException('Exercise not found');
    return ex;
  }

  async updateExercise(userId: string, id: string, payload: any) {
    const existing = await this.repo.findExerciseById(id);
    if (!existing) throw new NotFoundException('Exercise not found');
    if (existing.userId && existing.userId !== userId) throw new NotFoundException('Not authorized');
    return this.repo.updateExercise(id, payload as any);
  }

  // Sessions
  async createSession(userId: string, payload: any) {
    const session = await this.repo.createSession({ userId, templateId: payload.templateId ?? null, name: payload.name ?? null, startedAt: payload.startedAt ? new Date(payload.startedAt) : new Date(), notes: payload.notes ?? null } as any);
    return session;
  }

  async listSessions(userId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.repo.findSessions(userId, fromDate, toDate);
  }

  async getSession(userId: string, id: string) {
    const s = await this.repo.findSessionById(id);
    if (!s || s.userId !== userId) throw new NotFoundException('Session not found');
    return s;
  }

  async logSet(userId: string, sessionId: string, exerciseLogId: string, payload: any) {
    const session = await this.repo.findSessionById(sessionId);
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');

    const set = await this.repo.createSet({ exerciseLogId, setIndex: payload.setIndex ?? 0, reps: payload.reps ?? null, weight: payload.weight ?? null, unit: payload.unit ?? 'KG', durationSec: payload.durationSec ?? null, rpe: payload.rpe ?? null, isPR: payload.isPR ?? false, metadata: payload.metadata ?? {} } as any);

    // Queue background jobs: update PRs and recompute session summaries
    try {
      this.jobs.queue('workouts.updatePRs', { userId, sessionId, exerciseLogId, setId: set.id });
      this.jobs.queue('workouts.recomputeSummary', { userId, sessionId });
    } catch (e) {
      // noop - best effort
    }

    return set;
  }

  async listPRs(userId: string) {
    return this.repo.findPRs(userId);
  }
}

export default WorkoutsService;
