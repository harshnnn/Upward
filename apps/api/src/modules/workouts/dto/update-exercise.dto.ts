import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['STRENGTH','CARDIO','MOBILITY','SKILL','OTHER'])
  type?: string;

  @IsOptional()
  @IsEnum(['KG','LB','BODYWEIGHT','SECONDS','MINUTES'])
  defaultUnit?: string;
}

export default UpdateExerciseDto;
