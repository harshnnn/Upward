import { Injectable } from '@nestjs/common';
import { AuthProvider, DevicePlatform, Prisma, SessionStatus } from '@prisma/client';

import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { credential: true, devices: true }
    });
  }

  findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { credential: true }
    });
  }

  createUserWithCredential(args: {
    email: string;
    displayName?: string | undefined;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: args.email,
        displayName: args.displayName,
        credential: {
          create: {
            passwordHash: args.passwordHash,
            passwordChangedAt: new Date()
          }
        }
      },
      include: { credential: true, devices: true }
    });
  }

  createDevice(args: {
    userId: string;
    name: string;
    platform: DevicePlatform;
    deviceFingerprint?: string | undefined;
    pushToken?: string | undefined;
  }) {
    if (!args.deviceFingerprint) {
      return this.prisma.device.create({
        data: {
          userId: args.userId,
          name: args.name,
          platform: args.platform,
          pushToken: args.pushToken
        }
      });
    }

    return this.prisma.device.upsert({
      where: {
        userId_deviceFingerprint: {
          userId: args.userId,
          deviceFingerprint: args.deviceFingerprint
        }
      },
      create: {
        userId: args.userId,
        name: args.name,
        platform: args.platform,
        deviceFingerprint: args.deviceFingerprint,
        pushToken: args.pushToken
      },
      update: {
        name: args.name,
        platform: args.platform,
        pushToken: args.pushToken,
        lastSeenAt: new Date()
      }
    });
  }

  createSession(args: {
    userId: string;
    deviceId?: string | undefined;
    refreshTokenHash: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({
      data: {
        userId: args.userId,
        deviceId: args.deviceId,
        refreshTokenHash: args.refreshTokenHash,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        expiresAt: args.expiresAt
      }
    });
  }

  findSessionById(sessionId: string) {
    return this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true, device: true }
    });
  }

  findSessionByRefreshTokenHash(refreshTokenHash: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshTokenHash,
        status: SessionStatus.ACTIVE,
        deletedAt: null
      },
      include: { user: true, device: true }
    });
  }

  rotateSessionRefreshToken(sessionId: string, refreshTokenHash: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash,
        refreshTokenVersion: { increment: 1 },
        lastSeenAt: new Date()
      }
    });
  }

  revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
        refreshTokenHash: null
      }
    });
  }

  revokeSessionsForUser(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId, status: SessionStatus.ACTIVE },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
        refreshTokenHash: null
      }
    });
  }

  updatePasswordHash(userId: string, passwordHash: string) {
    return this.prisma.userCredential.update({
      where: { userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false
      }
    });
  }

  createPasswordResetToken(args: { userId: string; tokenHash: string; expiresAt: Date; requestedIp?: string }) {
    return this.prisma.passwordResetToken.create({
      data: {
        userId: args.userId,
        tokenHash: args.tokenHash,
        expiresAt: args.expiresAt,
        requestedIp: args.requestedIp
      }
    });
  }

  findLatestPasswordResetToken(userId: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { userId, usedAt: null, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  markPasswordResetTokenUsed(tokenId: string) {
    return this.prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() }
    });
  }

  createEmailVerificationToken(args: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.prisma.emailVerificationToken.create({
      data: {
        userId: args.userId,
        tokenHash: args.tokenHash,
        expiresAt: args.expiresAt
      }
    });
  }

  findLatestEmailVerificationToken(userId: string) {
    return this.prisma.emailVerificationToken.findFirst({
      where: { userId, usedAt: null, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  markEmailVerificationTokenUsed(tokenId: string) {
    return this.prisma.emailVerificationToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() }
    });
  }

  setUserEmailVerifiedAt(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() }
    });
  }

  recordAuditLog(args: {
    actorUserId?: string | undefined;
    targetUserId?: string | undefined;
    action: string;
    entityType: string;
    entityId?: string | undefined;
    requestId?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    metadata?: Prisma.JsonObject | undefined;
  }) {
    return this.prisma.authAuditLog.create({
      data: {
        actorUserId: args.actorUserId,
        targetUserId: args.targetUserId,
        action: args.action,
        entityType: args.entityType,
        entityId: args.entityId,
        requestId: args.requestId,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        metadata: args.metadata
      }
    });
  }
}
