import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class AppLogger implements NestLoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL ?? 'debug',
    redact: ['password', 'refreshToken', 'accessToken', 'authorization']
  });

  log(message: unknown, context?: string): void {
    this.logger.info({ context }, message as object);
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, message as object);
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn({ context }, message as object);
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug({ context }, message as object);
  }

  verbose(message: unknown, context?: string): void {
    this.logger.trace({ context }, message as object);
  }
}
