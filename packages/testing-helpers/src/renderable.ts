import type { TemplateResult } from 'lit';

export type LitHTMLRenderable = (
    TemplateResult
  | TemplateResult[]
  | Node | Node[]
  | string | string[]
  | number | number[]
  | boolean | boolean[]
);

export {};
