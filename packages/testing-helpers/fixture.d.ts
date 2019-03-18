import { TemplateResult } from 'lit-html';

export function fixtureSync<T extends Element = Element>(template: string | TemplateResult): T;
export function fixture<T extends Element = Element>(template: string | TemplateResult): Promise<T>;
export function fixtureCleanup(): void;
