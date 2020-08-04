const isHiddenFromScreenReader = (type, attributes) => {
  if (type.toUpperCase() === 'INPUT') {
    const hidden = attributes.type;

    if (hidden && hidden.toUpperCase() === 'HIDDEN') {
      return true;
    }
  }

  const ariaHidden = attributes['aria-hidden'];
  return ariaHidden === true;
};

module.exports = {
  isHiddenFromScreenReader,
};
