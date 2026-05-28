import { Module } from '@nestjs/common';
import { NutritionController } from './controllers/nutrition.controller';
import { NutritionService } from './services/nutrition.service';
import { NutritionRepository } from './repositories/nutrition.repository';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NutritionController],
  providers: [NutritionService, NutritionRepository],
  exports: [NutritionService]
})
export class NutritionModule {}

export default NutritionModule;
