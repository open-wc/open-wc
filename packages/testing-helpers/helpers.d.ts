type Constructor<T = {}> = new (...args: any[]) => T;

export function defineCE<TBase extends Constructor>(klass: TBase): string;
export function isIE(): boolean
export async function aTimeout(ms: int): void
export async function triggerBlurFor(element: HTMLElement): void
export async function triggerFocusFor(element: HTMLElement): void
export async function oneEvent(element: HTMLElement, eventName: string): Event
export async function nextFrame(): void
export async function flush(): void
