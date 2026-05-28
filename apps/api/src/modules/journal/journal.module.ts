import { Module } from '@nestjs/common';
import { JournalController } from './controllers/journal.controller';
import { JournalService } from './services/journal.service';
import { JournalRepository } from './repositories/journal.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JournalController],
  providers: [JournalService, JournalRepository],
  exports: [JournalService]
})
export class JournalModule {}

export default JournalModule;
