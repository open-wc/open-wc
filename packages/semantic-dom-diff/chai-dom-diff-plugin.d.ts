/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
    dom: Assertion;
    lightDom: Assertion;
    shadowDom: Assertion;
    equalSnapshot(options?: Object): Assertion;
  }

  interface Assert {
    dom: Assertion;
    lightDom: Assertion;
    shadowDom: Assertion;
    equalSnapshot(fixture: any, options?: Object): Assertion;
  }
}
