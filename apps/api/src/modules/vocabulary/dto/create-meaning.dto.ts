import { IsString, IsOptional } from 'class-validator';

export class CreateMeaningDto {
  @IsString()
  definition: string;

  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @IsOptional()
  examples?: any;
}

export default CreateMeaningDto;
