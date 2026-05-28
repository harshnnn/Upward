import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateMoodDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  score?: number;
}

export default CreateMoodDto;
