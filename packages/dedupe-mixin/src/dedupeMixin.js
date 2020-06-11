const appliedClassMixins = new WeakMap();

function wasApplied(mixin, superClass) {
  let proto = superClass;
  while (proto) {
    if (appliedClassMixins.get(proto) === mixin) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
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
