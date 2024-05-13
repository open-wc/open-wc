/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
    accessible(options?: Object): Promise<Assertion>;
  }

  interface Assert {
    isAccessible(fixture: any, options?: Object): Promise<Assertion>;
    isNotAccessible(fixture: any, options?: Object): Promise<Assertion>;
  }
}
