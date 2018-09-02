import { unsafeStatic } from '@open-wc/storybook';

// eslint-disable-next-line import/no-mutable-exports
export let opts = {
  tag: unsafeStatic('example-vanilla'),
  header: '<example-vanilla>',
};

export function setOptions(newOptions) {
  opts = newOptions;
}
