# IDE

Your IDE is your primary tool while working with code, we recommend the following tools and plugins to make developing Web Components easier.

## Visual Studio Code

We recommend [VSCode](https://code.visualstudio.com/). For alternative IDEs see  [here](alternatives.md)

For setup please visit the instructions on the Visual Studio Code [homepage](https://code.visualstudio.com/).

## Configuration

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

## Plugins

We recommend the following plugins:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)  
Get ESLint feedback directly in your IDE => more details under [Linting](./guide/linting)
* [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)  
Highlights all your html tagged template literals
* [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)  
Highlights all your css tagged template literals
