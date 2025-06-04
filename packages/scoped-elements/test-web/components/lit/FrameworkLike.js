import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class FrameworkLike extends ScopedElementsMixin(LitElement) {
  static properties = {
    step: { type: Number },
    steps: { type: Array },
  };

  constructor() {
    super();
    this.step = 0;
    this.steps = [];
  }

  async initialize(steps) {
    this.steps = steps;
    for (const { scopedElements } of this.steps) {
      for (const [element, importFn] of Object.entries(scopedElements)) {
        const klass = await importFn();
        this.registry.define(element, klass);
      }
    }

    this.requestUpdate();
  }

  next() {
    this.step += 1;
  }

  render() {
    return this.steps.length ? this.steps[this.step].render() : undefined;
  }
}
