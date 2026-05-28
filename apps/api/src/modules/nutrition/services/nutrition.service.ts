import { Injectable } from '@nestjs/common';
import { NutritionRepository } from '../repositories/nutrition.repository';

@Injectable()
export class NutritionService {
  constructor(private readonly repo: NutritionRepository) {}

  async createLog(userId: string, payload: any) {
    return this.repo.createLog({ userId, timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(), calories: payload.calories ?? null, proteinG: payload.proteinG ?? null, carbsG: payload.carbsG ?? null, fatG: payload.fatG ?? null, mealType: payload.mealType ?? null, metadata: payload.metadata ?? {} } as any);
  }

  async listLogs(userId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.repo.findLogs(userId, fromDate, toDate);
  }
}

export default NutritionService;
