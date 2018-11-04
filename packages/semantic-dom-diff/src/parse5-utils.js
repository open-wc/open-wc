export const isNode = arg => arg && 'nodeName' in arg;
export const isElement = arg => arg && 'tagName' in arg;
export const isParentNode = arg => arg && 'childNodes' in arg;
export const isTextNode = arg => arg && arg.nodeName === '#text';
export const isCommentNode = arg => arg && arg.nodeName === '#comment';
export const isDocumentFragment = arg => arg && arg.nodeName === '#document-fragment';
