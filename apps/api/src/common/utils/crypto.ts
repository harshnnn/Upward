import { randomBytes, createHash } from 'node:crypto';

export const generateToken = (bytes = 48): string => randomBytes(bytes).toString('hex');
export const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
