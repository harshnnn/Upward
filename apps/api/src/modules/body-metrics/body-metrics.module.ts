import { Module } from '@nestjs/common';
import { BodyMetricsController } from './controllers/body-metrics.controller';
import { BodyMetricsService } from './services/body-metrics.service';
import { BodyMetricsRepository } from './repositories/body-metrics.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BodyMetricsController],
  providers: [BodyMetricsService, BodyMetricsRepository],
  exports: [BodyMetricsService]
})
export class BodyMetricsModule {}

export default BodyMetricsModule;
