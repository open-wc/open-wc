/// <reference path="./chai-dom-diff-plugin.d.ts" />

export const chaiDomDiff: Chai.ChaiPlugin

// best guess based on https://github.com/wellguimaraes/mocha-snapshots/blob/cb4d4f00ee8a761461f8ccefba19dfdfa44c20a5/tests/__snapshots__/matchSnapshot.test.js.mocha-snapshot#L1-L50
interface Snapshot {
  code: string;
}

interface Snapshots {
  update: boolean;
  get(path: string[], index: number): Snapshot
  set(path: string[], index: number, html: string, type: 'html'): Snapshot
  match(html: string, test: string): boolean;
}

declare global {
  interface Window {
    __mocha_context__: Mocha.Context & { runnable: Mocha.Runnable & { type: string } };
    __snapshot__: Snapshots
  }
}
