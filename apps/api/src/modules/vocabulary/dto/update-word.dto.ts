import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class UpdateWordDto {
  @IsOptional()
  @IsString()
  word?: string;

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

export default UpdateWordDto;
