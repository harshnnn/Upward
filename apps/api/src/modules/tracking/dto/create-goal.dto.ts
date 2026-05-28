import { IsString, IsNotEmpty, IsObject, IsOptional, IsEnum } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  trackerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  target: Record<string, unknown>;

  @IsString()
  cadence: string; // daily/weekly/monthly/custom

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export default CreateGoalDto;
