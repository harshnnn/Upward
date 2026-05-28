import { Module } from '@nestjs/common';
import { TrackingController } from './controllers/tracking.controller';
import { TrackingService } from './services/tracking.service';
import { TrackingRepository } from './repositories/tracking.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingRepository],
  exports: [TrackingService]
})
export class TrackingModule {}

export default TrackingModule;
