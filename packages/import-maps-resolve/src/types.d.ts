export type SpecifierMap = Record<string, string>;

export type ScopesMap = Record<string, SpecifierMap>;

export interface ImportMap {
  imports?: SpecifierMap;
  scopes?: ScopesMap;
}

export type ParsedSpecifierMap = Record<string, URL | null>;

export type ParsedScopesMap = Record<string, ParsedSpecifierMap>;

export interface ParsedImportMap {
  imports?: ParsedSpecifierMap;
  scopes?: ParsedScopesMap;
}
