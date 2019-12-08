const foo = null;
const lorem = { ipsum: 'lorem ipsum'};

window.__optionalChaining = lorem?.ipsum === 'lorem ipsum' && lorem?.ipsum?.foo === undefined;
window.__nullishCoalescing = (foo ?? 'nullish colaesced') === 'nullish colaesced';
