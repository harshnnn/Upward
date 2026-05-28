import { IsString, IsISO8601 } from 'class-validator';

export class ScheduleRevisionDto {
  @IsString()
  wordId: string;

  @IsISO8601()
  scheduledAt: string;
}

export default ScheduleRevisionDto;
