import chai from 'chai';

type expect = typeof chai.expect;
type assert = typeof chai.assert;
type should = typeof chai.should;

declare function expect(...args: Parameters<expect>): ReturnType<expect>;
declare const assert: assert;
declare function should(...args: Parameters<should>): ReturnType<should>;

export { expect, assert, should };
