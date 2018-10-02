# Open Web Component Recommendations

We want to provide a good set of default on how to vasilitate your web component.

## Usage
```bash
mkdir my-element
cd my-element
# Minimum setup
npx -p yo -p generator-open-wc -c 'yo open-wc:vanilla-bare'
```

## Available Recommendations
```bash
# Demos using storybook
npx -p yo -p generator-open-wc -c 'yo open-wc:storybook'

# Linting using eslint
npx -p yo -p generator-open-wc -c 'yo open-wc:eslint'
```

## We proudly use
<a href="http://browserstack.com/" style="border: none;"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/Browserstack-logo.svg" width="200" alt="Browserstack Logo" /></a>

## Working on it

```bash
npm run bootstrap
# does: lerna bootstrap --hoist

# run demos
lerna run storybook --scope @open-wc/example-vanilla --stream

# eslint
lerna run lint:eslint --scope @open-wc/example-vanilla --stream
```
