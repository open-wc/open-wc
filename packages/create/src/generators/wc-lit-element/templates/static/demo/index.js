import { html, render } from 'lit-html';
import '../src/<%= tagName %>.js';

const title = 'test';
render(html`
  <<%= tagName %> .heading=${title}>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
    been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
    galley of type and scrambled it to make a type specimen book.
  </<%= tagName %>>
`, document.querySelector('#demo'));
