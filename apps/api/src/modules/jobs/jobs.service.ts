import { Injectable } from '@nestjs/common';

export type JobPayload = Record<string, unknown>;
export type JobHandler<TPayload extends JobPayload = JobPayload> = (payload: TPayload) => void | Promise<void>;

@Injectable()
export class JobsService {
  private readonly handlers = new Map<string, JobHandler>();

  register<TPayload extends JobPayload>(jobName: string, handler: JobHandler<TPayload>): void {
    this.handlers.set(jobName, handler as JobHandler);
  }

  queue<TPayload extends JobPayload>(jobName: string, payload: TPayload): void {
    const handler = this.handlers.get(jobName);
    if (!handler) {
      return;
    }

    void Promise.resolve()
      .then(() => handler(payload))
      .catch((error) => {
        console.error(`Job ${jobName} failed`, error);
      });
  }
}
