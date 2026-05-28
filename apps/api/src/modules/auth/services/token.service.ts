import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { generateToken, sha256 } from '../../../common/utils/crypto';
import { parseDurationToMs } from '../auth.utils';
import type { JwtPayload } from '../auth.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_TTL ?? '15m'
    });
  }

  createRefreshToken(): string {
    return generateToken(64);
  }

  hashRefreshToken(token: string): string {
    return sha256(token);
  }

  getAccessTokenExpiryMs(): number {
    return parseDurationToMs(process.env.JWT_ACCESS_TTL ?? '15m');
  }

  getRefreshTokenExpiryMs(): number {
    return parseDurationToMs(process.env.JWT_REFRESH_TTL ?? '30d');
  }
}
