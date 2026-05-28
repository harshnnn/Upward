import { IsOptional, IsString } from 'class-validator';

import type { AuthClientType } from '../auth.types';

export class LogoutDto {
  @IsString()
  sessionId!: string;

  @IsString()
  clientType!: AuthClientType;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
