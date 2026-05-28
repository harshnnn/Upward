import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotency: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user?: { id?: string }; body?: unknown }>();
    const response = context.switchToHttp().getResponse<Response>();

    const method = request.method.toUpperCase();
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return next.handle();
    }

    const userId = request.user?.id;
    const clientOpId = request.headers['x-client-op-id'];
    const normalizedClientOpId = Array.isArray(clientOpId) ? clientOpId[0] : clientOpId;

    if (!userId || typeof normalizedClientOpId !== 'string' || normalizedClientOpId.trim().length === 0) {
      return next.handle();
    }

    return from(this.idempotency.findByClientOpId(userId, normalizedClientOpId)).pipe(
      tap(existing => {
        if (existing) {
          response.setHeader('x-idempotent-replay', 'true');
        }
      }),
      // if the op already exists, return the stored response body immediately
      // otherwise, let the handler execute and persist the response afterward
      switchMap(existing => {
        if (existing?.responseBody !== null && existing?.responseBody !== undefined) {
          return of(existing.responseBody);
        }

        return next.handle().pipe(
          tap(result => {
            void this.idempotency.recordOperation({
              userId,
              clientOpId: normalizedClientOpId,
              method,
              path: request.originalUrl ?? request.url,
              requestBody: request.body,
              statusCode: response.statusCode,
              responseBody: result
            });
          })
        );
      })
    );
  }
}

export default IdempotencyInterceptor;
