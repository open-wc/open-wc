export const isElement = arg => arg && 'tagName' in arg;
export const isParentNode = arg => arg && 'childNodes' in arg;
