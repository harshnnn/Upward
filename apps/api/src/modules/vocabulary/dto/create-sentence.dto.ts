import { IsString, IsOptional } from 'class-validator';

export class CreateSentenceDto {
  @IsString()
  text: string;

  @IsOptional()
  isExample?: boolean;
}

export default CreateSentenceDto;
