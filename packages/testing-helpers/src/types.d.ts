export type OneEventFn = <TEvent extends Event = CustomEvent>(
  eventTarget: EventTarget,
  eventName: string,
) => Promise<TEvent>;

export type EventHasEmittedFn = (
  eventTarget: Event,
  eventName: string,
  milliseconds?: number,
) => Promise<boolean>;
