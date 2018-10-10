/* eslint-disable no-alert */

import {
  storiesOf,
  addParameters,
  html,
  action,
  linkTo,
  withBackgrounds,
  withNotes,
  document,
  // disable until https://github.com/storybooks/storybook/issues/4321 is resolved
  // withKnobs,
  // text,
  // button,
  // number,
  // select,
  // date,
  // color,
  // array,
  // boolean,
} from '@open-wc/storybook';

storiesOf('Addon|Actions', module)
  .add('Action only', () => html`
    <button @click=${action('log1')}>click me</button>
  `)
  .add('Action and method', () => html`
    <button @click=${e => action('log2')(e.target)}>click me</button>
  `);


storiesOf('Addon|Links', module)
  .add('To Welcome', () => html`
    <button @click=${linkTo('Welcome')}>Go to welcome</button>
  `);


storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ]),
  )
  .add('Button with text', () => `
    <button>Click me</button>
    <p>See tab "Backgrounds" at the bottom</p>
  `);


storiesOf('Addon|Notes', module)
  .addDecorator(withNotes)
  .add('Simple note', () => `
    <p><strong>See tab "notes" at the bottom.</strong></p>
  `, {
    notes: 'My notes on some <strong>bold</strong> text',
  });


storiesOf('Core|Methods for rendering', module)
  .add('html string', () => '<div>Rendered with string</div>')
  .add('document.createElement', () => {
    const el = document.createElement('button');
    el.innerText = 'click me';
    el.foo = 'bar';
    el.addEventListener('click', e => alert(e.target.foo));
    return el;
  })
  .add('lit-html', () => html`
    <button .foo=${'bar'} @click=${e => alert(e.target.foo)}>click me</button>
  `);


const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add('passed to story', ({ parameters: { fileName, ...parameters } }) => `
    <div>Parameters are ${JSON.stringify(parameters)}</div>
  `, {
    storyParameter,
  });

// disable until https://github.com/storybooks/storybook/issues/4321 is resolved
// storiesOf('Addon|Knobs', module)
//   .addDecorator(withKnobs)
//   .add('button label', () => html`
//     <button>${text('Button label', 'You can change me in the tab KNOBS')}</button>
//   `)
//   .add('complex', () => {
//     const name = text('Name', 'Jane');
//     const stock = number('Stock', 20, {
//       range: true, min: 0, max: 30, step: 5,
//     });
//     const fruits = {
//       Apple: 'apples',
//       Banana: 'bananas',
//       Cherry: 'cherries',
//     };
//     const fruit = select('Fruit', fruits, 'apples');
//     const price = number('Price', 2.25);
//     const colour = color('Border', 'deeppink');
//     const today = date('Today', new Date('Jan 20 2017 GMT+0'));
//     const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
//     const nice = boolean('Nice', true);

//     const stockMessage = stock
//       ? html`I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
//       : html`I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;
//     const dateOptions = {
//       year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
//     };

//     button('Arbitrary action', () => alert('You clicked it!'));

//     return html`
//       <div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
//         <h1>My name is ${name},</h1>
//         <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
//         <p>${stockMessage}</p>
//         <p>Also, I have:</p>
//         <ul>
//           ${items.map(item => html`
//             <li>${item}</li>
//           `)}
//         </ul>
//         <p>${nice ? 'Nice to meet you!' : 'Leave me alone!'}</p>
//       </div>
//     `;
//   });
