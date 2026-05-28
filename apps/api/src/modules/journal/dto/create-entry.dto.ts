import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsISO8601 } from 'class-validator';

export class CreateJournalEntryDto {
  @IsISO8601()
  timestamp: string; // ISO timestamp

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

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

export default CreateJournalEntryDto;
