import { unsafeStatic } from '@open-wc/storybook';

// eslint-disable-next-line import/no-mutable-exports
export let opts = {
  tag: unsafeStatic('<%= tagName %>'),
  header: '<<%= tagName %>>',
};

export function setOptions(newOptions) {
  opts = newOptions;
}
