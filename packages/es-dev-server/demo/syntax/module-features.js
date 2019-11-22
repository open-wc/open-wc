import { html, render } from 'lit-html';
import './module-features-a.js';

console.log('import.meta.url', import.meta.url);

(async () => {
  await import('./module-features-b.js');

  render(
    html`
      <p>Module features don't throw any syntax errors ✓</p>
      <p>import.meta.url works correctly: ${import.meta.url.replace(window.location.origin, '')} ✓</p>
    `,
    document.getElementById('module-features'),
  );
})();
