import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @IsNotEmpty()
  trackerId: string;

  @IsString()
  @IsNotEmpty()
  date: string; // ISO date string (YYYY-MM-DD)

  @IsOptional()
  @IsObject()
  value?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  note?: string;
}

export default CreateEntryDto;
