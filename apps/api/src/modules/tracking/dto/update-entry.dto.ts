import { IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateEntryDto {
  @IsOptional()
  @IsObject()
  value?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  note?: string;
}

export default UpdateEntryDto;
