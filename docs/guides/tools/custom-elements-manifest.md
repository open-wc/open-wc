# Tools >> Custom Elements Manifest || 20

[Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) (or <abbr>CEM</abbr>) is a JSON format for describing a packages' custom elements. It's usually stored as `custom-elements.json` in a package root, although the `customElements` top-level package.json key can point to any JSON file.

## Analyzer

The Open Web Components CEM analyzer scans your source code for custom elements or other JavaScript exports and outputs a `custom-elements.json`. The analyzer has a plugin-based architecture and there are many community plugins to do things like add non-standard data to the manifest or output a README.md file.

Learn more about the [custom elements manifest analyzer](https://custom-elements-manifest.open-wc.org) on its homepage.

<code-tabs default-tab="my-element.js">

```js tab my-element.js
class MyElement extends HTMLElement {
  static get observedAttributes() {
    return ['disabled'];
  }

  set disabled(val) {
    this.__disabled = val;
  }
  get disabled() {
    return this.__disabled;
  }

  fire() {
    this.dispatchEvent(new Event('disabled-changed'));
  }
}

customElements.define('my-element', MyElement);
```

```json tab custom-elements.json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "fixtures/-default/package/my-element.js",
      "declarations": [
        {
          "kind": "class",
          "description": "",
          "name": "MyElement",
          "members": [
            {
              "kind": "field",
              "name": "disabled"
            },
            {
              "kind": "method",
              "name": "fire"
            }
          ],
          "events": [
            {
              "name": "disabled-changed",
              "type": {
                "text": "Event"
              }
            }
          ],
          "attributes": [
            {
              "name": "disabled"
            }
          ],
          "superclass": {
            "name": "HTMLElement"
          },
          "tagName": "my-element"
        }
      ],
      "exports": [
        {
          "kind": "custom-element-definition",
          "name": "my-element",
          "declaration": {
            "name": "MyElement",
            "module": "fixtures/-default/package/my-element.js"
          }
        }
      ]
    }
  ]
}
```

</code-tabs>
