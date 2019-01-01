import { TemplateResult } from 'lit-html';

export function litFixtureSync(template: TemplateResult): Element;
export function litFixture(template: TemplateResult): Promise<Element>;
