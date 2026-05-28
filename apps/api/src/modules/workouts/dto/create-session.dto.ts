import { IsOptional, IsString, IsUUID, IsISO8601 } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsISO8601()
  startedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export default CreateSessionDto;
