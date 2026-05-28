import { IsOptional, IsString, IsBoolean, IsISO8601 } from 'class-validator';

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsISO8601()
  timestamp?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  moodId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  tags?: string[];
}

export default UpdateJournalEntryDto;
