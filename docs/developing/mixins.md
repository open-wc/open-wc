# Mixins

Mixins are a great way to share common capabilities across your web components. They're a great fit when:

* You need to centralize behavior you use to enhance the classes which power your components, or
* You need to layer the way properties and state flow into your components

## Sharing Capabilities

A common interaction in many systems are forms with multiple steps:

```js
class SimpleWizard1 extends LitElement {
  static get properties() {
    return {
      currentStepIndex: { type: Number },
    }
  }

  constructor() {
    super();
    this.currentStepIndex = 0;
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  get steps() {
    return [
      {
        name: "Step 1",
        template: () => html`
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        `
      },
      {
        name: "Step 2",
        template: () => html`
          <label for="description">Description</label>
          <input type="text" name="description" id="description" />
        `
      },
      {
        name: "Step 3",
        template: () => html`
          <label for="address">Address</label>
          <input type="text" name="address" id="address" />
        `
      }
    ]
  }

  previous() {
    this.currentStepIndex = this.isFirstStep
      ? this.currentStepIndex
      : this.currentStepIndex - 1;
  }

  next() {
    this.currentStepIndex = this.isLastStep
      ? this.currentStepIndex
      : this.currentStepIndex + 1;
  }

  get isFirstStep() {
    return this.currentStepIndex === 0;
  }

  get isLastStep() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  render() {
    return html`
      ${this.currentStep.template()}
      <div>
        ${
          !this.isFirstStep
            ? html`<button @click="${this.previous}">Previous</button>`
            : html``
        }
        ${
          !this.isLastStep
            ? html`<button @click="${this.next}">Next</button>`
            : html``
        }
        ${
          this.isLastStep
            ? html`<button>Submit</button>`
            : html``
        } 
      </div>
    `
  }
}
```

What happens when it's time to build our next multi-step form? Using a mixin, we can extract the common behavior of being "Steppable".

```js
export const Steppable = superClass => class extends superClass {
  constructor() {
    super();
    this.currentStepIndex = 0;
  }

  static get properties() {
    return {
      currentStepIndex: { type: Number },
    }
  }

  previous() {
    this.currentStepIndex = this.isFirstStep
      ? this.currentStepIndex
      : this.currentStepIndex - 1;
  }

  next() {
    this.currentStepIndex = this.isLastStep
      ? this.currentStepIndex
      : this.currentStepIndex + 1;
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  get isFirstStep() {
    return this.currentStepIndex === 0;
  }

  get isLastStep() {
    return this.currentStepIndex === this.steps.length - 1;
  }
}
```

Now, each of our wizard components only need to store what's unique to them

* the template
* and the steps!  

```js
class SteppableWizard1 extends Steppable(LitElement) {
  get steps() {
    return [
      {
        name: "Step 1",
        template: () => html`
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        `
      },
      {
        name: "Step 2",
        template: () => html`
          <label for="description">Description</label>
          <input type="text" name="description" id="description" />
        `
      },
            {
        name: "Step 3",
        template: () => html`
          <label for="address">Address</label>
          <input type="text" name="address" id="address" />
        `
      }
    ]
  }

  render() {
    return html`
      ${this.currentStep.template()}
      <div>
        ${
          !this.isFirstStep
            ? html`<button @click="${this.previous}">Previous</button>`
            : html``
        }
        ${
          !this.isLastStep
            ? html`<button @click="${this.next}">Next</button>`
            : html``
        }
        ${
          this.isLastStep
            ? html`<button>Submit</button>`
            : html``
        } 
      </div>
    `
  }
}
```

```js
class SteppableWizard2 extends Steppable(LitElement) {
  get steps() {
    return [
      {
        name: "Step 1",
        template: () => html`
          <label for="title">Title</label>
          <input type="text" name="title" id="title" />
        `
      },
      {
        name: "Step 2",
        template: () => html`
          <label for="content">Content</label>
          <textarea type="textarea" name="content" id="content" />
        `
      },
            {
        name: "Step 3",
        template: () => html`
          <label for="tags">Tags</label>
          <input type="text" name="tags" id="tags" />
        `
      }
    ]
  }

  render() {
    return html`
      ${this.currentStep.template()}
      <div>
        ${
          !this.isFirstStep
            ? html`<button @click="${this.previous}">Previous</button>`
            : html``
        }
        ${
          !this.isLastStep
            ? html`<button @click="${this.next}">Next</button>`
            : html``
        }
        ${
          this.isLastStep
            ? html`<button>Submit</button>`
            : html``
        } 
      </div>
    `
  }
}
```

## Enforcing Interfaces

Example: pwa-helpers/connect-mixin

Internal Example: enforcing the setting of `get steps()`

## Sharing Properties & Events

* Go into more depth on how `LitElement` can consume two differen `static get properties()`
* Go into how to handle lifecycle methods

## Testing Mixins

* Go into how to test these