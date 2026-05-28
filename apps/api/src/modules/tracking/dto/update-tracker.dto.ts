import { IsOptional, IsString, IsEnum, IsObject } from 'class-validator';
import { TrackerType } from '@prisma/client';

export class UpdateTrackerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TrackerType)
  type?: TrackerType;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export default UpdateTrackerDto;
