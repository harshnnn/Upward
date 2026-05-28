import { Module } from '@nestjs/common';
import { WorkoutsController } from './controllers/workouts.controller';
import { WorkoutsService } from './services/workouts.service';
import { WorkoutsRepository } from './repositories/workouts.repository';
import { PrismaModule } from '../../database/prisma.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [PrismaModule, JobsModule],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsRepository],
  exports: [WorkoutsService]
})
export class WorkoutsModule {}

export default WorkoutsModule;
