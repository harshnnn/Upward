import { Injectable } from '@nestjs/common';
import { BodyMetricsRepository } from '../repositories/body-metrics.repository';

@Injectable()
export class BodyMetricsService {
  constructor(private readonly repo: BodyMetricsRepository) {}

  async create(userId: string, payload: any) {
    return this.repo.create({ userId, type: payload.type, value: payload.value, unit: payload.unit ?? 'kg', measuredAt: payload.measuredAt ? new Date(payload.measuredAt) : new Date(), metadata: payload.metadata ?? {} } as any);
  }

  async list(userId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.repo.find(userId, fromDate, toDate);
  }
}

export default BodyMetricsService;
