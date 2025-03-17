import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class WithoutStaticScopedElements extends ScopedElementsMixin(LitElement) {}
