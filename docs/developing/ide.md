# IDE

Your IDE is your primary tool while working with code, we recommend the following tools and plugins to make developing Web Components easier.

## Visual Studio Code

We recommend [VSCode](https://code.visualstudio.com/). For setup please visit the instructions on the Visual Studio Code [homepage](https://code.visualstudio.com/).

### Configuration

We recommend the following user settings:
```json
{
    "files.autoSave": "onWindowChange",
    "editor.tabSize": 2,
    "files.trimTrailingWhitespace": true,
    "[markdown]": {
        "files.trimTrailingWhitespace": false
    },
}
```
**How to set up**:
1. File > Preferences > Settings
1. click on "..." > Open settings.json

![VSCodeSettings](/ide-vscode-settings.gif)

### Plugins

We recommend the following plugins:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
Get ESLint feedback directly in your IDE => more details under [Linting](/linting/)
* [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
Highlights all your html tagged template literals
* [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
Syntax highlighting, type checking and code completion for lit-html
* [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
Highlights all your css tagged template literals

## Atom

An alternative to VSCode is [Atom](https://atom.io/), an IDE created by Github. It provides near-native support for working with web components and has great support for template literals.

### Recomended plugins
 - [atom-typescript](https://atom.io/packages/atom-typescript) - Typescript support
 - [prettier-atom](https://atom.io/packages/prettier-atom) - Template literal highlighting and formatting
 - [docblockr](https://atom.io/packages/docblockr) - Documentation helper
 - [import-cost](https://atom.io/packages/atom-import-cost) - Displays import costs inline
