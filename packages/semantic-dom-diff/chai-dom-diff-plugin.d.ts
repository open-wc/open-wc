/// <reference types="chai" />

import { DiffOptions } from './get-diffable-html';

declare global {
  namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      dom: DomDiffAssertion;
      lightDom: DomDiffAssertion;
      shadowDom: DomDiffAssertion;
      equal: DomDiffEqual;
      equals: DomDiffEqual;
      eq: DomDiffEqual;
      eql: DomDiffEqual;
      eqls: DomDiffEqual;
      to: DomDiffAssertion;
      be: DomDiffAssertion;
      been: DomDiffAssertion;
      is: DomDiffAssertion;
      that: DomDiffAssertion;
      which: DomDiffAssertion;
      and: DomDiffAssertion;
      has: DomDiffAssertion;
      have: DomDiffAssertion;
      with: DomDiffAssertion;
      at: DomDiffAssertion;
      of: DomDiffAssertion;
      same: DomDiffAssertion;
      but: DomDiffAssertion;
      does: DomDiffAssertion;
    }

    interface DomDiffEqual {
      (value: unknown, message?: string, options?: DiffOptions): Promise<Assertion>;
      (value: unknown, options?: DiffOptions): Promise<Assertion>;
    }

    interface DomDiffAssertion extends Assertion {
      notEqual(actual: Object, expected: Object, message?: string): void;
      equalSnapshot(options?: Object): Promise<Assertion>;
      notEqualSnapshot(options?: Object): Promise<Assertion>;
    }

    interface Assert {
      dom: Pick<DomDiffAssertion, 'equal' | 'notEqual' | 'equalSnapshot' | 'notEqualSnapshot'>;
      lightDom: Pick<DomDiffAssertion, 'equal' | 'notEqual' | 'equalSnapshot' | 'notEqualSnapshot'>;
      shadowDom: Pick<DomDiffAssertion, 'equal' | 'notEqual' | 'equalSnapshot' | 'notEqualSnapshot'>;
    }
  }
}
