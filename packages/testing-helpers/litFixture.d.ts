import { FixtureWrapper } from './fixture';

export function litFixtureSync(template: TemplateResult): FixtureWrapper;
export async function litFixture(template: TemplateResult): FixtureWrapper;
