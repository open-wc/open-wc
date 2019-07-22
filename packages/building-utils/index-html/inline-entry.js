const REGEXP_INLINE_ENTRY = /inline-entry.[\d]+.js/g;
const REGEXP_ID = /[\d]+/;

/**
 * Returns the inline module id, if any.
 * @param {string} modulePath
 * @returns {number|null}
 */
function findInlineEntryId(modulePath) {
  const inlineModule = modulePath.match(REGEXP_INLINE_ENTRY);

  // if we matched multiple strings something went wrong
  if (!inlineModule || inlineModule.length !== 1) {
    return null;
  }

  // if we matched multiple ids something went wrong
  const id = inlineModule[0].match(REGEXP_ID);
  return id && id.length === 1 ? Number(id[0]) : null;
}

module.exports = {
  findInlineEntryId,
};
