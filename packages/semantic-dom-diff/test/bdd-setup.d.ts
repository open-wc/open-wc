/// <reference path="../chai-dom-diff-plugin.d.ts" />
/// <reference types="chai" />

declare const expect: typeof chai.expect;
declare const assert: typeof chai.assert;
declare const should: typeof chai.should;

export { expect, assert, should };

declare global {
  interface Window {
    chai: typeof chai;
  }
}
