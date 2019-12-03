import './a/b/import-meta-test-2.ts';

async function asyncFunction(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1));
  return true;
}

function forOf() {
  const map = new Map<string, number>();
  map.set('a', 1);
  map.set('2', 2);
  let total = 0;
  for (const [k, v] of map) {
    total += v;
  }
  return total;
}

console.log('async function compiled to: ', asyncFunction.toString());
console.log('forOf function compiled to: ', forOf.toString());

window.__startsWith = 'foo'.startsWith('fo');
window.__map = new Map().set('foo', 'bar').get('foo') === 'bar';
window.__importMeta =
  import.meta.url.startsWith(window.location.origin) && import.meta.url.endsWith('syntax.ts');
window.__asyncFunction = asyncFunction();
window.__forOf = forOf() === 3;
