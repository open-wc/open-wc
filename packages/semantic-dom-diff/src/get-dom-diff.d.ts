import { DocumentFragment } from 'parse5';

interface DiffResult {
  message: String;
  path: String;
  normalizedLeftHTML: String;
  normalizedRightHTML: String;
}

export function getAST(value, config): DocumentFragment
export function getSemanticDomDiff(leftHTML, rightHTML, config): DiffResult
