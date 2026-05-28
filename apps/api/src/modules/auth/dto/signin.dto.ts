import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

import type { AuthClientType } from '../auth.types';

export class SigninDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  clientType!: AuthClientType;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @ValidateIf((value: SigninDto) => value.deviceFingerprint !== undefined)
  @IsString()
  deviceFingerprint?: string;
}
