import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthProvider, DevicePlatform, SessionStatus } from '@prisma/client';

import { clearRefreshCookie, setRefreshCookie } from '../../../common/utils/cookies';
import { generateToken, sha256 } from '../../../common/utils/crypto';
import { EventBusService } from '../../events/event-bus.service';
import { JobsService } from '../../jobs/jobs.service';
import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import type {
  AuthClientType,
  AuthenticatedUser,
  JwtPayload
} from '../auth.types';
import type { AuthResponse } from '@upward/types';
import { UsersService } from '../../users/services/users.service';
import type { Response } from 'express';
import { normalizeEmail } from '@upward/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBusService,
    private readonly jobsService: JobsService
  ) {}

  async signup(input: {
    email: string;
    password: string;
    displayName?: string;
    clientType: AuthClientType;
    deviceName?: string;
    deviceFingerprint?: string | undefined;
    request?: Request;
    response?: Response;
  }): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const passwordHash = await this.passwordService.hash(input.password);
    const user = await this.authRepository.createUserWithCredential({
      email,
      displayName: input.displayName,
      passwordHash
    });

    const authResult = await this.createSessionAndTokens({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      clientType: input.clientType,
      deviceName: input.deviceName ?? 'Primary device',
      deviceFingerprint: input.deviceFingerprint,
      request: input.request,
      response: input.response
    });

    await this.authRepository.recordAuditLog({
      targetUserId: user.id,
      action: 'CREATE',
      entityType: 'USER',
      entityId: user.id,
      requestId: input.request?.headers['x-request-id'] ? String(input.request.headers['x-request-id']) : undefined,
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent']
        ? String(input.request.headers['user-agent'])
        : undefined
    });

    this.eventBus.publish('user.created', { userId: user.id, email: user.email });

    return authResult;
  }

  async login(input: {
    email: string;
    password: string;
    clientType: AuthClientType;
    deviceName?: string;
    deviceFingerprint?: string | undefined;
    request?: Request;
    response?: Response;
  }): Promise<AuthResponse> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    if (!user?.credential?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.passwordService.verify(user.credential.passwordHash, input.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSessionAndTokens({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      clientType: input.clientType,
      deviceName: input.deviceName ?? 'Primary device',
      deviceFingerprint: input.deviceFingerprint,
      request: input.request,
      response: input.response
    });
  }

  async refresh(input: {
    clientType: AuthClientType;
    refreshToken?: string;
    request?: Request;
    response?: Response;
  }): Promise<AuthResponse> {
    const refreshToken = this.getRefreshTokenFromRequest(input);
    const refreshTokenHash = sha256(refreshToken);
    const session = await this.authRepository.findSessionByRefreshTokenHash(refreshTokenHash);

    if (!session || session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.authRepository.revokeSession(session.id);
      throw new UnauthorizedException('Session expired');
    }

    const nextRefreshToken = this.tokenService.createRefreshToken();
    await this.authRepository.rotateSessionRefreshToken(
      session.id,
      this.tokenService.hashRefreshToken(nextRefreshToken)
    );

    const accessToken = await this.tokenService.createAccessToken({
      sub: session.userId,
      email: session.user.email,
      role: session.user.role,
      sessionId: session.id
    });

    this.applyRefreshCookieIfNeeded(input.response, input.clientType, nextRefreshToken);

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
        role: session.user.role,
        emailVerifiedAt: session.user.emailVerifiedAt ? session.user.emailVerifiedAt.toISOString() : null
      },
      session: {
        id: session.id,
        deviceId: session.deviceId,
        status: session.status,
        expiresAt: session.expiresAt.toISOString(),
        lastSeenAt: session.lastSeenAt ? session.lastSeenAt.toISOString() : null
      },
      tokens: {
        accessToken,
        refreshToken: input.clientType === 'mobile' ? nextRefreshToken : undefined,
        expiresInSeconds: Math.floor(this.tokenService.getAccessTokenExpiryMs() / 1000)
      }
    };
  }

  async logout(input: {
    sessionId: string;
    clientType: AuthClientType;
    refreshToken?: string;
    request?: Request;
    response?: Response;
  }): Promise<{ success: true }> {
    const session = await this.authRepository.findSessionById(input.sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.authRepository.revokeSession(session.id);
    if (input.response) {
      clearRefreshCookie(input.response);
    }

    await this.authRepository.recordAuditLog({
      actorUserId: session.userId,
      targetUserId: session.userId,
      action: 'LOGOUT',
      entityType: 'SESSION',
      entityId: session.id,
      requestId: input.request?.headers['x-request-id'] ? String(input.request.headers['x-request-id']) : undefined,
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent'] ? String(input.request.headers['user-agent']) : undefined
    });

    return { success: true };
  }

  async requestPasswordReset(input: {
    email: string;
    request?: Request;
  }): Promise<{ success: true }> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      return { success: true };
    }

    const token = generateToken(32);
    await this.authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      requestedIp: input.request?.ip
    });

    this.jobsService.queue('auth.password_reset_requested', {
      userId: user.id,
      email: user.email,
      token
    });

    return { success: true };
  }

  async confirmPasswordReset(input: {
    email: string;
    token: string;
    newPassword: string;
    request?: Request;
  }): Promise<{ success: true }> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid password reset token');
    }

    const latestToken = await this.authRepository.findLatestPasswordResetToken(user.id);
    if (!latestToken || latestToken.usedAt || latestToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid password reset token');
    }

    if (latestToken.tokenHash !== sha256(input.token)) {
      throw new UnauthorizedException('Invalid password reset token');
    }

    const passwordHash = await this.passwordService.hash(input.newPassword);
    await this.authRepository.recordAuditLog({
      targetUserId: user.id,
      action: 'UPDATE',
      entityType: 'USER_CREDENTIAL',
      entityId: user.id,
      requestId: input.request?.headers['x-request-id'] ? String(input.request.headers['x-request-id']) : undefined,
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent'] ? String(input.request.headers['user-agent']) : undefined,
      metadata: { reason: 'password_reset' }
    });

    await this.authRepository.revokeSessionsForUser(user.id);
    await this.authRepository.updatePasswordHash(user.id, passwordHash);
    await this.authRepository.markPasswordResetTokenUsed(latestToken.id);

    await this.authRepository.recordAuditLog({
      targetUserId: user.id,
      action: 'UPDATE',
      entityType: 'PASSWORD_RESET',
      entityId: latestToken.id,
      requestId: input.request?.headers['x-request-id'] ? String(input.request.headers['x-request-id']) : undefined,
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent'] ? String(input.request.headers['user-agent']) : undefined,
      metadata: { reason: 'password_reset' }
    });

    return { success: true };
  }

  async requestEmailVerification(input: {
    email: string;
    request?: Request;
  }): Promise<{ success: true }> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      return { success: true };
    }

    const token = generateToken(32);
    await this.authRepository.createEmailVerificationToken({
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });

    this.jobsService.queue('auth.email_verification_requested', {
      userId: user.id,
      email: user.email,
      token
    });

    return { success: true };
  }

  async confirmEmailVerification(input: {
    email: string;
    token: string;
    request?: Request;
  }): Promise<{ success: true }> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    const latestToken = await this.authRepository.findLatestEmailVerificationToken(user.id);
    if (!latestToken || latestToken.usedAt || latestToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (latestToken.tokenHash !== sha256(input.token)) {
      throw new UnauthorizedException('Invalid verification token');
    }

    await this.authRepository.markEmailVerificationTokenUsed(latestToken.id);
    await this.authRepository.setUserEmailVerifiedAt(user.id);

    return { success: true };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    };
  }

  private async createSessionAndTokens(input: {
    userId: string;
    email: string;
    displayName: string | null;
    role: 'USER' | 'ADMIN';
    clientType: AuthClientType;
    deviceName: string;
    deviceFingerprint?: string;
    request?: Request;
    response?: Response;
  }): Promise<AuthResponse> {
    const refreshToken = this.tokenService.createRefreshToken();
    const devicePlatform = this.resolveDevicePlatform(input.clientType);

    const device = await this.authRepository.createDevice({
      userId: input.userId,
      name: input.deviceName,
      platform: devicePlatform,
      deviceFingerprint: input.deviceFingerprint
    });

    const session = await this.authRepository.createSession({
      userId: input.userId,
      deviceId: device?.id,
      refreshTokenHash: this.tokenService.hashRefreshToken(refreshToken),
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent'] ? String(input.request.headers['user-agent']) : undefined,
      expiresAt: new Date(Date.now() + this.tokenService.getRefreshTokenExpiryMs())
    });

    const accessToken = await this.tokenService.createAccessToken({
      sub: input.userId,
      email: input.email,
      role: input.role,
      sessionId: session.id
    });

    this.applyRefreshCookieIfNeeded(input.response, input.clientType, refreshToken);

    await this.authRepository.recordAuditLog({
      actorUserId: input.userId,
      targetUserId: input.userId,
      action: 'LOGIN',
      entityType: 'SESSION',
      entityId: session.id,
      requestId: input.request?.headers['x-request-id'] as string | undefined,
      ipAddress: input.request?.ip,
      userAgent: input.request?.headers['user-agent'] ? String(input.request.headers['user-agent']) : undefined
    });

    this.eventBus.publish('user.signed_in', { userId: input.userId, sessionId: session.id });

    return {
      user: {
        id: input.userId,
        email: input.email,
        displayName: input.displayName,
        role: input.role,
        emailVerifiedAt: null
      },
      session: {
        id: session.id,
        deviceId: session.deviceId,
        status: session.status,
        expiresAt: session.expiresAt.toISOString(),
        lastSeenAt: null
      },
      tokens: {
        accessToken,
        refreshToken: input.clientType === 'mobile' ? refreshToken : undefined,
        expiresInSeconds: Math.floor(this.tokenService.getAccessTokenExpiryMs() / 1000)
      }
    };
  }

  private resolveDevicePlatform(clientType: AuthClientType): DevicePlatform {
    return clientType === 'mobile' ? DevicePlatform.ANDROID : DevicePlatform.WEB;
  }

  private applyRefreshCookieIfNeeded(
    response: Response | undefined,
    clientType: AuthClientType,
    refreshToken: string
  ): void {
    if (!response || clientType !== 'web') {
      return;
    }

    setRefreshCookie(response, refreshToken, this.tokenService.getRefreshTokenExpiryMs());
  }

  private getRefreshTokenFromRequest(input: { refreshToken?: string; request?: Request }): string {
    const cookieToken = input.request?.cookies?.upward_refresh_token as string | undefined;
    const token = input.refreshToken ?? cookieToken;

    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }

    return token;
  }
}
