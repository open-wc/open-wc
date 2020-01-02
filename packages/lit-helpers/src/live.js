/* eslint-disable no-param-reassign, no-restricted-syntax, guard-for-in, no-console */
import { directive, PropertyPart, AttributePart } from 'lit-html';

export const live = directive((/** @type {unknown} */ value) => (
  /** @type {PropertyPart | AttributePart} */ part,
) => {
  const { element, name, strings } = part.committer;

  if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
    throw new Error('live directive bindings must not contain any static values');
  }

  if (part.committer.parts.length > 1) {
    throw new Error('live directive must be the only directive for an attribute or property');
  }

  if (part instanceof PropertyPart) {
    if (element[name] !== value) {
      part.setValue(value);
    }
    return;
  }

  if (part instanceof AttributePart) {
    if (element.getAttribute(name) !== value) {
      part.setValue(value);
    }
    return;
  }

  throw new Error('live directive can only be used on attributes or properties');
});
