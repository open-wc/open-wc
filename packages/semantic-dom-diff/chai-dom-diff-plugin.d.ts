/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
    dom: Assertion;
    lightDom: Assertion;
    shadowDom: Assertion;
    notEqual(actual: Object, expected: Object, message?: string): void;
    equalSnapshot(options?: Object): Assertion;
    notEqualSnapshot(options?: Object): Assertion;
  }

  interface Assert {
    dom: Assertion;
    lightDom: Assertion;
    shadowDom: Assertion;
    equalSnapshot(fixture: any, options?: Object): Assertion;
  }
}
