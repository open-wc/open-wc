
export type OneEventFn =
  <TEvent extends Event = CustomEvent>(eventTarget: EventTarget, eventName: string, preventDefault: boolean)=> Promise<TEvent>