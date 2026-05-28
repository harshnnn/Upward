import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class TrackingRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTracker(data: Prisma.TrackerCreateInput) {
    return this.prisma.tracker.create({ data });
  }

  findTrackers(userId: string, skip = 0, take = 20) {
    return this.prisma.tracker.findMany({ where: { userId, isArchived: false }, skip, take, orderBy: { createdAt: 'desc' } });
  }

  findTrackerById(id: string) {
    return this.prisma.tracker.findUnique({ where: { id } });
  }

  updateTracker(id: string, data: Prisma.TrackerUpdateInput) {
    return this.prisma.tracker.update({ where: { id }, data });
  }

  deleteTracker(id: string) {
    return this.prisma.tracker.update({ where: { id }, data: { isArchived: true } });
  }

  createEntry(data: Prisma.TrackerEntryCreateInput) {
    return this.prisma.trackerEntry.create({ data });
  }

  findEntries(userId: string, trackerId?: string, from?: Date, to?: Date, skip = 0, take = 50) {
    const where: any = { userId };
    if (trackerId) where.trackerId = trackerId;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }

    return this.prisma.trackerEntry.findMany({ where, skip, take, orderBy: { date: 'desc' } });
  }

  updateEntry(id: string, data: Prisma.TrackerEntryUpdateInput) {
    return this.prisma.trackerEntry.update({ where: { id }, data });
  }

  deleteEntry(id: string) {
    return this.prisma.trackerEntry.delete({ where: { id } });
  }

  createGoal(data: Prisma.GoalCreateInput) {
    return this.prisma.goal.create({ data });
  }

  findGoals(userId: string) {
    return this.prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  // Daily summaries
  upsertDailySummary(userId: string, date: Date, metrics: Prisma.JsonObject) {
    return this.prisma.dailySummary.upsert({
      where: { userId_date: { userId, date } } as any,
      create: { userId, date, metrics },
      update: { metrics }
    });
  }
}

export default TrackingRepository;
