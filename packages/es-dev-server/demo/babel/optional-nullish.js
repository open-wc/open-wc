const object = {};

window.__optionalNullish = (object?.foo?.bar ?? 'foo') === 'foo';