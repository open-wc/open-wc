export declare type Constructor<T = {}> = new (...args: any[]) => T;

export declare function dedupeMixin<T extends (s: Constructor) => any>(mixin: T): T;
