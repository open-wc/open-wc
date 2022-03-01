import type { TemplateResult } from 'lit';

interface Lit1TemplateResult { 
  processor: any,
  strings: TemplateStringsArray,
  type: string,
  values: readonly unknown[]
}

export type LitHTMLRenderable = (
    Lit1TemplateResult 
  | TemplateResult
  | TemplateResult[]
  | Node | Node[]
  | string | string[]
  | number | number[]
  | boolean | boolean[]
);

export {};
