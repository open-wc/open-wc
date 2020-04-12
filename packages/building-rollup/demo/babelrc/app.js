class Foo {
  static bar = 'bar';
  static getBar() {
    return this.bar;
  }
  #foo = 'foo';

  getFoo() {
    return this.#foo;
  }

  getBar() {
    return Foo.getBar();
  }
}

const foo = new Foo();

console.log(`${foo.getFoo()} ${foo.getBar()}`);
