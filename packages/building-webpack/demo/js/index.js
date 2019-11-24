import './demo-app.js';
import './syntax.js';

(async () => {
  window.__tests = {
    partialCSS: window.__partialCSS || false,
    litElement: (await window.__litElement) || false,
    startsWith: window.__startsWith || false,
    map: window.__map || false,
    importMeta: window.__importMeta || false,
    importMeta2: window.__importMeta2 || false,
    asyncFunction: (await window.__asyncFunction) || false,
    forOf: window.__forOf || false,
  };
  document.getElementById('test').innerHTML = `<pre>${JSON.stringify(
    window.__tests,
    null,
    2,
  )}</pre>`;
})();
