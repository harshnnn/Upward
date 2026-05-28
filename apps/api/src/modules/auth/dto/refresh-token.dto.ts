import { IsOptional, IsString } from 'class-validator';

import type { AuthClientType } from '../auth.types';

export class RefreshTokenDto {
  @IsString()
  clientType!: AuthClientType;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
