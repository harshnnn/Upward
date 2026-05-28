import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

import type { AuthClientType } from '../auth.types';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsString()
  clientType!: AuthClientType;

  @ValidateIf((value: SignupDto) => value.deviceName !== undefined)
  @IsString()
  deviceName?: string;

  @ValidateIf((value: SignupDto) => value.deviceFingerprint !== undefined)
  @IsString()
  deviceFingerprint?: string;
}
