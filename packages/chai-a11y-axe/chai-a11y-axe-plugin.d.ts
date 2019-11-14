/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
    accessible(options?: Object): Assertion;
  }

  interface Assert {
    isAccessible(fixture: any, options?: Object): Assertion;
    isNotAccessible(fixture: any, options?: Object): Assertion;
  }
}
