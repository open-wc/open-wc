
export type OneEventFn =
  <TEvent extends Event = CustomEvent>(eventTarget: EventTarget, eventName: string) => Promise<TEvent>