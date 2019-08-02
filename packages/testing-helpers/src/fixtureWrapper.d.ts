/**
 * Creates a wrapper as a direct child of `<body>` to put the tested element into.
 * Need to be in the DOM to test for example `connectedCallback()` on elements.
 *
 * @returns {Element}
 */
export function fixtureWrapper(): Element;
/**
 * Cleans up all defined fixtures by removing the actual wrapper nodes.
 * Common usecase is at the end of each test.
 */
export function fixtureCleanup(): void;
/** @type Array<Element> */
export const cachedWrappers: Array<Element>;
