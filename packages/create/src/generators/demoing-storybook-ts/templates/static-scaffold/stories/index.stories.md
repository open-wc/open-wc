```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/<%= tagName %>.js';

export default {
  title: '<%= className %>',
  component: '<%= tagName %>',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# <%= className %>

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add <%= tagName %>
```

```js
import '<%= tagName %>/<%= tagName %>.js';
```

```js preview-story
export const Simple = () => html`
  <<%= tagName %>></<%= tagName %>>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <<%= tagName %> title="Hello World"></<%= tagName %>>
`;
```
