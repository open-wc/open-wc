type Constructor<T = {}> = new (...args: any[]) => T;

export function defineCE<TBase extends Constructor>(klass: TBase): string;
export function isIE(): boolean
export function aTimeout(ms: number): Promise<void>
export function triggerBlurFor(element: HTMLElement): Promise<void>
export function triggerFocusFor(element: HTMLElement): Promise<void>
export function oneEvent(element: HTMLElement, eventName: string): Promise<Event>
export function nextFrame(): Promise<void>
export function flush(): Promise<void>
