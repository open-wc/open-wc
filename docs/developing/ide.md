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
  }
}
```

**How to set up**:

1. File > Preferences > Settings
1. click on "..." > Open settings.json

![VSCodeSettings](/ide-vscode-settings.gif)

### Plugins

We recommend the following plugins:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  Get ESLint feedback directly in your IDE => more details under [Linting](/linting/)
- [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
  Highlights all your html tagged template literals
- [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
  Syntax highlighting, type checking and code completion for lit-html
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
  Highlights all your css tagged template literals

## Atom

An alternative to VSCode is [Atom](https://atom.io/), an IDE created by Github. It provides near-native support for working with web components and has great support for template literals.

### Recommended plugins

- [atom-typescript](https://atom.io/packages/atom-typescript) - TypeScript support
- [prettier-atom](https://atom.io/packages/prettier-atom) - Template literal highlighting and formatting
- [docblockr](https://atom.io/packages/docblockr) - Documentation helper
- [import-cost](https://atom.io/packages/atom-import-cost) - Displays import costs inline

## [Intellij IDEA](https://www.jetbrains.com/idea/) and other Jetbrains variants

Another possible alternative for development is IntelliJ IDEA. IntelliJ is a Java integrated development environment (IDE) for developing computer software. It is developed by JetBrains (formerly known as IntelliJ), and is available as an Apache 2 Licensed community edition and in a proprietary commercial edition.

Syntax highlighting from html and css in template literals should be supported out of the box. Generic web components related functionalitites such as Custom Elements support and completion is also available. You can read more about it [here](https://blog.jetbrains.com/phpstorm/2013/10/phpstorm-7-web-toolkit-javascript-templates-web-components-support/).

![intellij-syntax0-highlighting](/intellij-syntax-highlighting.png)

Due to the support available directly in the IDE, the ecosystem for plugins is very limited and we do not recommend any.

## [Sublime Text 3](https://www.sublimetext.com/3)

Officially called a text editor Sublime Text features plugins which give it a lot of the possibilities of the IDE's listed above. It is available for Windows, Linux and OSX and can be evaluated for free.

### Recommended plugins

- [Lit Element Syntax Highlighting](https://packagecontrol.io/packages/LitElement%20Syntax%20Highlighting) - Syntax highlighting
- [docblockr](https://packagecontrol.io/packages/DocBlockr) - Documentation helper
- [TypeScript](https://packagecontrol.io/packages/TypeScript) - TypeScript support
