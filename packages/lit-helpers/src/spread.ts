import { ElementPart, Part } from 'lit';
import { nothing } from 'lit/html.js';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

type EventListenerWithOptions = EventListenerOrEventListenerObject &
    Partial<AddEventListenerOptions>;


/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spreadProps } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spreadProps({
 *              prop1: 'prop1',
 *              prop2: ['Prop', '2'],
 *              prop3: {
 *                  prop: 3,
 *              }
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export class SpreadPropsDirective extends AsyncDirective {
    host!: EventTarget | object | Element;
    element!: Element;
    prevData: { [key: string]: unknown } = {};

    render(_spreadData: { [key: string]: unknown }) {
        return nothing;
    }
    update(part: Part, [spreadData]: Parameters<this['render']>) {
        if (this.element !== (part as ElementPart).element) {
            this.element = (part as ElementPart).element;
        }
        this.host = part.options?.host || this.element;
        this.apply(spreadData);
        this.groom(spreadData);
        this.prevData = { ...spreadData };
    }

    apply(data: { [key: string]: unknown }) {
        if (!data) return;
        const { prevData, element } = this;
        for (const key in data) {
            const value = data[key];
            if (value === prevData[key]) {
                continue;
            }
            // @ts-ignore
            element[key] = value;
        }
    }

    groom(data: { [key: string]: unknown }) {
        const { prevData, element } = this;
        if (!prevData) return;
        for (const key in prevData) {
            if (!data || (!(key in data) && element[key] === prevData[key])) {
                // @ts-ignore
                element[key] = undefined;
            }
        }
    }
}

export const spreadProps = directive(SpreadPropsDirective);

/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spreadEvents } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spreadEvents({
 *            '@my-event': () => console.log('my-event fired'),
 *            '@my-other-event': () => console.log('my-other-event fired'),
 *            '@my-additional-event':
 *              () => console.log('my-additional-event fired'),
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export class SpreadEventsDirective extends SpreadPropsDirective {
    eventData: { [key: string]: unknown } = {};

    apply(data: { [key: string]: unknown }) {
        if (!data) return;
        for (const key in data) {
            const value = data[key];
            if (value === this.eventData[key]) {
                // do nothing if the same value is being applied again.
                continue;
            }
            this.applyEvent(key, value as EventListenerWithOptions);
        }
    }

    applyEvent(eventName: string, eventValue: EventListenerWithOptions) {
        const { prevData, element } = this;
        this.eventData[eventName] = eventValue;
        const prevHandler = prevData[eventName];
        if (prevHandler) {
            element.removeEventListener(eventName, this, eventValue);
        }
        element.addEventListener(eventName, this, eventValue);
    }

    groom(data: { [key: string]: unknown }) {
        const { prevData, element } = this;
        if (!prevData) return;
        for (const key in prevData) {
            if (!data || (!(key in data) && element[key] === prevData[key])) {
                this.groomEvent(key, prevData[key] as EventListenerWithOptions)
            }
        }
    }

    groomEvent(eventName: string, eventValue: EventListenerWithOptions) {
        const { element } = this;
        delete this.eventData[eventName];
        element.removeEventListener(eventName, this, eventValue);
    }

    handleEvent(event: Event) {
        const value: Function | EventListenerObject = this.eventData[
            event.type
        ] as Function | EventListenerObject;
        if (typeof value === 'function') {
            (value as Function).call(this.host, event);
        } else {
            (value as EventListenerObject).handleEvent(event);
        }
    }

    disconnected() {
        const { eventData, element } = this;
        for (const key in eventData) {
            // event listener
            const name = key.slice(1);
            const value = eventData[key] as EventListenerWithOptions;
            element.removeEventListener(name, this, value);
        }
    }

    reconnected() {
        const { eventData, element } = this;
        for (const key in eventData) {
            // event listener
            const name = key.slice(1);
            const value = eventData[key] as EventListenerWithOptions;
            element.addEventListener(name, this, value);
        }
    }
}

export const spreadEvents = directive(SpreadEventsDirective);

/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spread } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spread({
 *            'my-attribute': 'foo',
 *            '?my-boolean-attribute': true,
 *            '.myProperty': { foo: 'bar' },
 *            '@my-event': () => console.log('my-event fired'),
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export class SpreadDirective extends SpreadEventsDirective {
    apply(data: { [key: string]: unknown }) {
        if (!data) return;
        const { prevData, element } = this;
        for (const key in data) {
            const value = data[key];
            if (value === prevData[key]) {
                continue;
            }
            const name = key.slice(1);
            switch (key[0]) {
                case '@': // event listener
                    this.eventData[name] = value;
                    this.applyEvent(name, value as EventListenerWithOptions);
                    break;
                case '.': // property
                    // @ts-ignore
                    element[name] = value;
                    break;
                case '?': // boolean attribute
                    if (value) {
                        element.setAttribute(name, '');
                    } else {
                        element.removeAttribute(name);
                    }
                    break;
                default:
                    // standard attribute
                    if (value != null) {
                        element.setAttribute(key, String(value));
                    } else {
                        element.removeAttribute(key);
                    }
                    break;
            }
        }
    }

    groom(data: { [key: string]: unknown }) {
        const { prevData, element } = this;
        if (!prevData) return;
        for (const key in prevData) {
            const name = key.slice(1);
            if (!data || (!(key in data) && element[name] === prevData[key])) {
                switch (key[0]) {
                    case '@': // event listener
                        this.groomEvent(name, prevData[key] as EventListenerWithOptions)
                        break;
                    case '.': // property
                        // @ts-ignore
                        element[name] = undefined;
                        break;
                    case '?': // boolean attribute
                        element.removeAttribute(name);
                        break;
                    default:
                        // standard attribute
                        element.removeAttribute(key);
                        break;
                }
            }
        }
    }
}

export const spread = directive(SpreadDirective);