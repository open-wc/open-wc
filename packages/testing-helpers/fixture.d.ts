import { TemplateResult } from 'lit-html';

export function fixtureSync(template: string | TemplateResult): Element;
export function fixture(template: string | TemplateResult): Promise<Element>;
