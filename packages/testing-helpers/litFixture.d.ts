import { TemplateResult } from 'lit-html';

export function litFixtureSync<T extends Element = Element>(template: TemplateResult): T;
export function litFixture<T extends Element = Element>(template: TemplateResult): Promise<T>;
