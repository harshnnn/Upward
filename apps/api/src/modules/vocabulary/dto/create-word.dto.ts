import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateWordDto {
  @IsString()
  word: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsInt()
  difficulty?: number;

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export default CreateWordDto;
