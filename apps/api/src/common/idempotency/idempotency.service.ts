import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  findByClientOpId(userId: string, clientOpId: string) {
    return this.prisma.clientOperation.findUnique({
      where: { userId_clientOpId: { userId, clientOpId } } as any
    });
  }

  async recordOperation(params: {
    userId: string;
    clientOpId: string;
    method: string;
    path: string;
    requestBody?: unknown;
    statusCode?: number;
    responseBody?: unknown;
  }) {
    const { userId, clientOpId, method, path, requestBody, statusCode, responseBody } = params;

    return this.prisma.clientOperation.upsert({
      where: { userId_clientOpId: { userId, clientOpId } } as any,
      create: {
        userId,
        clientOpId,
        method,
        path,
        requestBody: requestBody as never,
        statusCode,
        responseBody: responseBody as never
      },
      update: {
        method,
        path,
        requestBody: requestBody as never,
        statusCode,
        responseBody: responseBody as never
      }
    });
  }
}

export default IdempotencyService;
