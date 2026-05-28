import { randomBytes, createHash } from 'node:crypto';

export const generateSecureToken = (bytes = 48): string => randomBytes(bytes).toString('hex');

export const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
