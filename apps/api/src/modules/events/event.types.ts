export type DomainEvent<TType extends string, TPayload extends Record<string, unknown>> = {
  eventId: string;
  eventType: TType;
  occurredAt: string;
  payload: TPayload;
};
