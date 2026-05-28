import { IsString, IsOptional } from 'class-validator';

export class ReviewEventDto {
  @IsString()
  wordId: string;

  @IsString()
  eventType: string;

  @IsOptional()
  metadata?: any;
}

export default ReviewEventDto;
