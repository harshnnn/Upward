import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export const RequestContextMiddleware = (
  request: Request & { id?: string },
  response: Response,
  next: NextFunction
): void => {
  const requestId = request.headers['x-request-id'];
  const requestWithId = request as Request & { id: string };
  requestWithId.id = Array.isArray(requestId) ? requestId[0] : requestId ?? randomUUID();
  response.setHeader('x-request-id', requestWithId.id);
  next();
};
