import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'node:events';

@Injectable()
export class EventBusService {
  private readonly emitter = new EventEmitter();

  publish<TPayload extends Record<string, unknown>>(eventName: string, payload: TPayload): void {
    this.emitter.emit(eventName, payload);
  }

  subscribe<TPayload extends Record<string, unknown>>(
    eventName: string,
    handler: (payload: TPayload) => void
  ): void {
    this.emitter.on(eventName, handler);
  }
}
