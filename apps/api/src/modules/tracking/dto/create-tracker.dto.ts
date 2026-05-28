import { IsString, IsOptional, IsEnum, IsObject, IsNotEmpty } from 'class-validator';
import { TrackerType } from '@prisma/client';

export class CreateTrackerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TrackerType)
  type: TrackerType;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export default CreateTrackerDto;
