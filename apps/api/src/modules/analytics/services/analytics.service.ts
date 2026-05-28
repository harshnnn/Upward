import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { JobsService } from '../../jobs/jobs.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly repo: AnalyticsRepository, private readonly jobs: JobsService) {
    this.jobs.register('analytics.recomputeDaily', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('workouts.updatePRs', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('workouts.recomputeSummary', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('vocab.wordCreated', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('vocab.meaningAdded', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('vocab.sentenceAdded', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('vocab.revisionScheduled', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });

    this.jobs.register('vocab.reviewRecorded', async ({ userId, date }) => {
      await this.refreshDailySummary(String(userId), date ? new Date(String(date)) : new Date());
    });
  }

  private async refreshDailySummary(userId: string, date: Date) {
    const summary = await this.buildDailySummary(userId, date);
    await this.repo.upsertDailySummary(userId, date, summary);
    return summary;
  }

  private async buildDailySummary(userId: string, date: Date) {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const tracker = await this.repo.getDailySummary(userId, day);
    const workout = await this.repo.getWorkoutSummary(userId, day);
    const journal = await this.repo.getJournalSummary(userId, day);
    const vocab = await this.repo.getVocabularySummary(userId, day);
    const nutrition = await this.repo.getNutritionAggregates(userId, day);
    const body = await this.repo.getBodyMetricsAggregates(userId, day);

    return {
      date: day.toISOString(),
      tracker: tracker?.metrics ?? {},
      workout: workout?.metrics ?? {},
      journal: journal?.metrics ?? {},
      vocab: vocab?.metrics ?? {},
      nutrition,
      body
    };
  }

  // Return combined daily summary from various summary tables
  async getDailySummary(userId: string, date?: Date) {
    const d = date ?? new Date();
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    return this.buildDailySummary(userId, day);
  }

  async getHeatmap(userId: string, from?: Date, to?: Date) {
    // heatmap over activity density per day using daily_summaries + workout_summaries
    return this.repo.getDateCounts(userId, from, to);
  }

  async getStreaks(userId: string) {
    // compute or return precomputed streaks from tracking/streak tables
    return this.repo.getStreaks(userId);
  }

  async getTrends(userId: string, metric: string, from?: Date, to?: Date) {
    // generic trend builder: aggregate daily metrics into time series
    return this.repo.getMetricTimeSeries(userId, metric, from, to);
  }

  // Exposed for background jobs to trigger recompute
  async recomputeDailySummary(userId: string, date: Date) {
    try {
      this.jobs.queue('analytics.recomputeDaily', { userId, date: date.toISOString() });
    } catch (e) {
      // best effort enqueue
    }
  }
}

export default AnalyticsService;
