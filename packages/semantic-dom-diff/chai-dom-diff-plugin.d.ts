/// <reference types="chai" />

import { DiffOptions } from "./get-diffable-html";

declare global {
  namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      dom: Assertion;
      lightDom: Assertion;
      shadowDom: Assertion;
      notEqual(actual: Object, expected: Object, message?: string): void;
      equalSnapshot(options?: Object): Assertion;
      notEqualSnapshot(options?: Object): Assertion;
    }

    interface Assert {
      dom: Pick<Assertion, 'equal'|'notEqual'|'equalSnapshot'|'notEqualSnapshot'>;
      lightDom: Pick<Assertion, 'equal'|'notEqual'|'equalSnapshot'|'notEqualSnapshot'>;
      shadowDom: Pick<Assertion, 'equal'|'notEqual'|'equalSnapshot'|'notEqualSnapshot'>;
      equalSnapshot(fixture: any, options?: DiffOptions): Assertion;
      notEqualSnapshot(fixture: any, options?: DiffOptions): Assertion;

      equal<T>(actual: T, expected: T, message?: string, options?: DiffOptions): void;
      equal<T>(actual: T, expected: T, message?: string): void;
      equal<T>(actual: T, expected: T, options?: DiffOptions): void;

      notEqual<T>(actual: T, expected: T, message?: string, options?: DiffOptions): void;
      notEqual<T>(actual: T, expected: T, message?: string): void;
      notEqual<T>(actual: T, expected: T, options?: DiffOptions): void;
    }

    interface Equal {
      (value: any, message?: string, options?: DiffOptions): Assertion;
      (value: any, options?: DiffOptions): Assertion;
    }
  }
}