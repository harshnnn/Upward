import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertDailySummary(userId: string, date: Date, metrics: Record<string, unknown>) {
    return this.prisma.dailySummary.upsert({
      where: { userId_date: { userId, date } } as any,
      create: { userId, date, metrics },
      update: { metrics }
    });
  }

  getDailySummary(userId: string, date: Date) {
    return this.prisma.dailySummary.findUnique({ where: { userId_date: { userId, date } } as any });
  }

  getWorkoutSummary(userId: string, date: Date) {
    return this.prisma.workoutSummary.findFirst({ where: { userId, date } });
  }

  getJournalSummary(userId: string, date: Date) {
    return this.prisma.journalSummary.findFirst({ where: { userId, date } });
  }

  getVocabularySummary(userId: string, date: Date) {
    return this.prisma.vocabularySummary.findFirst({ where: { userId, date } });
  }

  async getNutritionAggregates(userId: string, date: Date) {
    // aggregate nutrition logs for the date (UTC day boundary)
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate()+1);

    const rows = await this.prisma.nutritionLog.findMany({ where: { userId, timestamp: { gte: start, lt: end } } });
    const totals = rows.reduce((acc, r) => ({ calories: (acc.calories||0)+(r.calories||0), proteinG: (acc.proteinG||0)+(r.proteinG||0), carbsG: (acc.carbsG||0)+(r.carbsG||0), fatG: (acc.fatG||0)+(r.fatG||0) }), {} as any);
    return totals;
  }

  async getBodyMetricsAggregates(userId: string, date: Date) {
    // return last recorded body weight of the day and other metrics
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate()+1);

    const rows = await this.prisma.bodyMetric.findMany({ where: { userId, measuredAt: { gte: start, lt: end } }, orderBy: { measuredAt: 'desc' }, take: 10 });
    return rows;
  }

  // Heatmap counts of activity per day
  async getDateCounts(userId: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }
    // Use dailySummary table for activity metric counts
    const rows = await this.prisma.dailySummary.findMany({ where, select: { date: true, metrics: true } });
    // map to {date: count}
    return rows.map(r => ({ date: r.date, metrics: r.metrics }));
  }

  async getStreaks(userId: string) {
    return this.prisma.streak.findMany({ where: { userId } });
  }

  async getMetricTimeSeries(userId: string, metric: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from;
      if (to) where.date.lte = to;
    }
    const rows = await this.prisma.dailySummary.findMany({ where, orderBy: { date: 'asc' } });
    // extract metric path
    return rows.map(r => ({ date: r.date, value: r.metrics ? r.metrics[metric] ?? null : null }));
  }
}

export default AnalyticsRepository;
