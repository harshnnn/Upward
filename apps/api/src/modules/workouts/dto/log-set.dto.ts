import { IsInt, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class LogSetDto {
  @IsInt()
  setIndex: number;

  @IsOptional()
  @IsInt()
  reps?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsInt()
  durationSec?: number;

  @IsOptional()
  @IsInt()
  rpe?: number;

  @IsOptional()
  @IsBoolean()
  isPR?: boolean;
}

export default LogSetDto;
