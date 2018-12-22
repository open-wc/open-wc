type PropsFunction = (element: HTMLElement) => Object;
type FixtureProps = Object | PropsFunction;
export class FixtureWrapper extends HTMLElement { };
export function fixtureSync(template: string, props?: FixtureProps): FixtureWrapper;
export async function fixture(template: string, setup?: FixtureProps): Promise<FixtureWrapper>;
