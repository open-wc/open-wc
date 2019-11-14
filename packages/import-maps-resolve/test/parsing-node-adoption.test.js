/* eslint-disable no-restricted-syntax */
import { expectSpecifierMap } from './helpers/parsing.js';
// import { BUILT_IN_MODULE_SCHEME } from '../src/utils.js';

describe('Relative node addresses', () => {
  it('should accept strings prefixed with ./, ../, or /', () => {
    expectSpecifierMap(
      `{
        "dotSlash": "./foo",
        "dotDotSlash": "../foo",
        "slash": "/foo"
      }`,
      '/home/foo/project-a::/path1/path2/path3',
      {
        dotSlash: ['/home/foo/project-a/path1/path2/foo'],
        dotDotSlash: ['/home/foo/project-a/path1/foo'],
        slash: ['/home/foo/project-a/foo'],
      },
    );
  });

  it('should accept the literal strings ./, ../, or / with no suffix', () => {
    expectSpecifierMap(
      `{
        "dotSlash": "./",
        "dotDotSlash": "../",
        "slash": "/"
      }`,
      '/home/foo/project-a::/path1/path2/path3',
      {
        dotSlash: ['/home/foo/project-a/path1/path2/'],
        dotDotSlash: ['/home/foo/project-a/path1/'],
        slash: ['/home/foo/project-a/'],
      },
    );
  });
});
