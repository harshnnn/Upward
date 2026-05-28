import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  getReadiness(): { status: string } {
    return { status: 'ready' };
  }
}
