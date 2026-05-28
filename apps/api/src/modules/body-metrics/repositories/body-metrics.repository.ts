import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BodyMetricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.bodyMetric.create({ data });
  }

  find(userId: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.measuredAt = {};
      if (from) where.measuredAt.gte = from;
      if (to) where.measuredAt.lte = to;
    }
    return this.prisma.bodyMetric.findMany({ where, orderBy: { measuredAt: 'desc' }, take: 500 });
  }
}

export default BodyMetricsRepository;
