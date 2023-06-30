/**
 * Checks if the given element has a non-empty aria-label, aria-labelledby or title attribute.
 * @param {Object} element - The HTML element to check.
 * @param {boolean} checkTitle - Whether to check for the title attribute.
 * @returns {boolean} True if the element has a non-empty aria-label, aria-labelledby or (optionally) title attribute, false otherwise.
 */
function hasAccessibleName(element, checkTitle = true) {
  const hasAriaLabel =
    element?.attribs?.['aria-label'] !== undefined && element.attribs['aria-label'].trim() !== '';
  const hasAriaLabelledBy =
    element?.attribs?.['aria-labelledby'] !== undefined &&
    element.attribs['aria-labelledby'].trim() !== '';
  const hasTitle =
    checkTitle && element?.attribs?.title !== undefined && element.attribs.title.trim() !== '';

  return hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

module.exports = {
  hasAccessibleName,
};
