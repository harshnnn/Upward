import { Module } from '@nestjs/common';
import { VocabularyController } from './controllers/vocabulary.controller';
import { VocabularyService } from './services/vocabulary.service';
import { VocabularyRepository } from './repositories/vocabulary.repository';
import { PrismaModule } from '../../database/prisma.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [PrismaModule, JobsModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyRepository],
  exports: [VocabularyService]
})
export class VocabularyModule {}

export default VocabularyModule;
