import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class NutritionRepository {
  constructor(private readonly prisma: PrismaService) {}

  createLog(data: any) {
    return this.prisma.nutritionLog.create({ data });
  }

  findLogs(userId: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = from;
      if (to) where.timestamp.lte = to;
    }
    return this.prisma.nutritionLog.findMany({ where, orderBy: { timestamp: 'desc' }, take: 500 });
  }
}

export default NutritionRepository;
