import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackingRepository } from '../repositories/tracking.repository';
import type { CreateTrackerDto } from '../dto/create-tracker.dto';

@Injectable()
export class TrackingService {
  constructor(private readonly repo: TrackingRepository) {}

  async createTracker(userId: string, payload: any) {
    const data = {
      userId,
      name: payload.name,
      description: payload.description ?? null,
      type: payload.type,
      key: payload.key ?? `trk_${Date.now().toString(36)}`,
      config: payload.config ?? {},
      categoryId: payload.categoryId ?? null
    };

    return this.repo.createTracker(data as any);
  }

  async listTrackers(userId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    return this.repo.findTrackers(userId, skip, perPage);
  }

  async getTracker(userId: string, id: string) {
    const tracker = await this.repo.findTrackerById(id);
    if (!tracker || tracker.userId !== userId) throw new NotFoundException('Tracker not found');
    return tracker;
  }

  async updateTracker(userId: string, id: string, payload: any) {
    const existing = await this.repo.findTrackerById(id);
    if (!existing || existing.userId !== userId) throw new NotFoundException('Tracker not found');
    return this.repo.updateTracker(id, payload as any);
  }

  async deleteTracker(userId: string, id: string) {
    const existing = await this.repo.findTrackerById(id);
    if (!existing || existing.userId !== userId) throw new NotFoundException('Tracker not found');
    return this.repo.deleteTracker(id);
  }

  async createEntry(userId: string, payload: any) {
    const entry = await this.repo.createEntry({
      userId,
      trackerId: payload.trackerId,
      date: new Date(payload.date),
      valueJson: payload.value ?? {},
      note: payload.note ?? null
    } as any);

    // TODO: trigger streak/summary updates via events or background jobs

    return entry;
  }

  async listEntries(userId: string, trackerId?: string, from?: string, to?: string, page = 1, perPage = 50) {
    const skip = (page - 1) * perPage;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.repo.findEntries(userId, trackerId, fromDate, toDate, skip, perPage);
  }

  async updateEntry(userId: string, id: string, payload: any) {
    const existing = await this.repo.updateEntry(id, payload as any).catch(() => null);
    if (!existing) throw new NotFoundException('Entry not found');
    return existing;
  }

  async deleteEntry(userId: string, id: string) {
    const deleted = await this.repo.deleteEntry(id).catch(() => null);
    if (!deleted) throw new NotFoundException('Entry not found');
    return deleted;
  }

  async createGoal(userId: string, payload: any) {
    return this.repo.createGoal({ userId, ...payload } as any);
  }

  async listGoals(userId: string) {
    return this.repo.findGoals(userId);
  }

  async upsertDailySummary(userId: string, date: string, metrics: any) {
    const d = new Date(date);
    return this.repo.upsertDailySummary(userId, d, metrics);
  }
}

export default TrackingService;
