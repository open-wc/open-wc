import { expect } from '@open-wc/testing';
import { transform } from '../src/transform.js';
import { toCache } from '../src/cache.js';

const testHtml = (strings, ...values) => [strings, values];
const getNameForCEClass = klass => transform(['', ''], [klass])[0][0];

describe('transform', () => {
  it('registers names for Custom Element classes in values and concatenates strings with those names', () => {
    class MyTulip extends HTMLElement {}

    const [strings, ...values] = transform(
      ...testHtml`<${MyTulip} id="${'my-id'}">${'my text'}</${MyTulip}>`,
    );
    expect(strings).to.deep.equal(['<my-tulip id="', '">', '</my-tulip>']);
    expect(values).to.deep.equal(['my-id', 'my text']);
    expect(customElements.get('my-tulip').prototype instanceof MyTulip).to.be.true;
  });

  it('should return the cached value if there is a match', () => {
    const ClassA = class extends HTMLElement {};
    const strings = ['<', '>', '</', '>'];
    const values = [ClassA, 'text sample', ClassA];
    const transformedStrings = ['<x-a>', '</x-a>'];
    toCache(strings, {
      keys: [
        [0, ClassA],
        [2, ClassA],
      ],
      indexes: [1],
      strings: transformedStrings,
    });

    const [newStrings, ...newValues] = transform(strings, values);

    expect(newStrings).to.be.equal(transformedStrings);
    expect(newValues).to.be.deep.equal(['text sample']);
  });

  it('should replace the cached value if there is a cache failure', () => {
    const ClassA = class extends HTMLElement {};
    const ClassB = class extends HTMLElement {};
    const strings = ['<', '>', '</', '>'];
    const values = [ClassA, 'text sample', ClassA];
    toCache(strings, {
      keys: [
        [0, ClassB],
        [2, ClassB],
      ],
      indexes: [1],
      strings: ['<class-b>', '</class-b>'],
    });

    const [newStrings, ...newValues] = transform(strings, values);

    expect(newStrings).to.be.deep.equal(['<class-a>', '</class-a>']);
    expect(newValues).to.be.deep.equal(['text sample']);
  });

  it("should return the cached value while classes don't change", () => {
    const ClassA = class extends HTMLElement {};
    const strings = ['<', '>', '</', '>'];

    const [stringsA, ...valuesA] = transform(strings, [ClassA, 'text sample', ClassA]);
    const [stringsB, ...valuesB] = transform(strings, [ClassA, 'another text sample', ClassA]);

    expect(stringsA).to.be.equal(stringsB);
    expect(valuesA).to.be.deep.equal(['text sample']);
    expect(valuesB).to.be.deep.equal(['another text sample']);
  });

  describe('concatenation', () => {
    it('concatenates element names with no other expressions', () => {
      class MyViolet extends HTMLElement {}

      const [strings, ...values] = transform(...testHtml`<${MyViolet}></${MyViolet}>`);
      expect(strings).to.deep.equal(['<my-violet></my-violet>']);
      expect(values).to.deep.equal([]);
      expect(customElements.get('my-violet').prototype instanceof MyViolet).to.be.true;
    });

    it('concatenates element names with a text node expression', () => {
      class MyDaisy extends HTMLElement {}

      const [strings, ...values] = transform(...testHtml`<${MyDaisy}>${'my text'}</${MyDaisy}>`);
      expect(strings).to.deep.equal(['<my-daisy>', '</my-daisy>']);
      expect(values).to.deep.equal(['my text']);
      expect(customElements.get('my-daisy').prototype instanceof MyDaisy).to.be.true;
      const [strings2, ...values2] = transform(...testHtml`<${MyDaisy}>my text</${MyDaisy}>`);
      expect(strings2).to.deep.equal(['<my-daisy>my text</my-daisy>']);
      expect(values2).to.deep.equal([]);
    });

    it('concatenates element names with an attribute value expression', () => {
      class MySunflower extends HTMLElement {}

      const [strings, ...values] = transform(
        ...testHtml`<${MySunflower} id="${'my-id'}"></${MySunflower}>`,
      );
      expect(strings).to.deep.equal(['<my-sunflower id="', '"></my-sunflower>']);
      expect(values).to.deep.equal(['my-id']);
      expect(customElements.get('my-sunflower').prototype instanceof MySunflower).to.be.true;
      const [strings2, ...values2] = transform(
        ...testHtml`<${MySunflower} id="my-id"></${MySunflower}>`,
      );
      expect(strings2).to.deep.equal(['<my-sunflower id="my-id"></my-sunflower>']);
      expect(values2).to.deep.equal([]);
    });

    it('keeps untouched when there are no expressions', () => {
      const [strings, ...values] = transform(...testHtml`<my-rose></my-rose>`);
      expect(strings).to.deep.equal(['<my-rose></my-rose>']);
      expect(values).to.deep.equal([]);
      expect(customElements.get('my-rose')).to.be.undefined;
    });

    it('ignores unrelated classes', () => {
      class MyMagnolia {}

      const [strings, ...values] = transform(...testHtml`<${MyMagnolia}></${MyMagnolia}>`);
      expect(strings).to.deep.equal(['<', '></', '>']);
      expect(values).to.deep.equal([MyMagnolia, MyMagnolia]);
      expect(customElements.get('my-magnolia')).to.not.exist;
      const [strings2, ...values2] = transform(...testHtml`<${MyMagnolia}/>`);
      expect(strings2).to.deep.equal(['<', '/>']);
      expect(values2).to.deep.equal([MyMagnolia]);
    });
  });

  describe('name generator', () => {
    it('derives a name from the constructor by transforming it to dash-case', () => {
      class MyCrocus extends HTMLElement {}

      expect(getNameForCEClass(MyCrocus)).to.equal('my-crocus');
      expect(customElements.get('my-crocus').prototype instanceof MyCrocus).to.be.true;
    });

    it('does not register the same class twice', () => {
      class MyIris extends HTMLElement {}

      expect(getNameForCEClass(MyIris)).to.equal('my-iris');
      expect(getNameForCEClass(MyIris)).to.equal('my-iris');
      expect(customElements.get('my-iris').prototype instanceof MyIris).to.be.true;
    });

    it('adds an incremented index to the name if the same constructor name is encountered', () => {
      const name1 = (() => {
        class MyPrimrose extends HTMLElement {}

        return getNameForCEClass(MyPrimrose);
      })();
      const name2 = (() => {
        class MyPrimrose extends HTMLElement {}

        return getNameForCEClass(MyPrimrose);
      })();
      expect(name1).to.equal('my-primrose');
      expect(name2).to.equal('my-primrose-2');
    });

    it('adds an incremented index to the name if the same name was registered natively before', () => {
      customElements.define('my-hibiscus', class extends HTMLElement {});
      const name2 = (() => {
        class MyHibiscus extends HTMLElement {}

        return getNameForCEClass(MyHibiscus);
      })();
      expect(name2).to.equal('my-hibiscus-2');
      customElements.define('my-hibiscus-3', class extends HTMLElement {});
      const name4 = (() => {
        class MyHibiscus extends HTMLElement {}

        return getNameForCEClass(MyHibiscus);
      })();
      expect(name4).to.equal('my-hibiscus-4');
    });

    it('adds a prefix "c-" if constructor name in dash-case has no dash', () => {
      const name1 = (() => {
        class Moonflower extends HTMLElement {}

        return getNameForCEClass(Moonflower);
      })();
      const name2 = (() => {
        class Moonflower extends HTMLElement {}

        return getNameForCEClass(Moonflower);
      })();
      expect(name1).to.equal('c-moonflower');
      expect(name2).to.equal('c-moonflower-2');
      customElements.define('c-moonflower-3', class extends HTMLElement {});
      const name4 = (() => {
        class Moonflower extends HTMLElement {}

        return getNameForCEClass(Moonflower);
      })();
      expect(name4).to.equal('c-moonflower-4');
    });
  });
});
