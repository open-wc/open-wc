const appliedClassMixins = new WeakMap();

function getPrototypeChain(obj) {
  const chain = [];
  let proto = obj;
  while (proto) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}

function wasApplied(mixin, superClass) {
  const classes = getPrototypeChain(superClass);
  for (const klass of classes) {
    if (appliedClassMixins.get(klass) === mixin) {
      return true;
    }
  }
  return false;
}

export function dedupeMixin(mixin) {
  return superClass => {
    if (wasApplied(mixin, superClass)) {
      return superClass;
    }
    const mixedClass = mixin(superClass);
    appliedClassMixins.set(mixedClass, mixin);
    return mixedClass;
  };
}
