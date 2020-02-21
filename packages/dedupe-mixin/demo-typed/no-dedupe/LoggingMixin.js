export const LoggingMixin = superclass =>
  // we add the class name so it can show up when debugging (instead of an anonymous class)
  // eslint-disable-next-line no-shadow
  class LoggingMixin extends superclass {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.logString(`"${this.tagName.toLowerCase()}" connected`);
    }

    // eslint-disable-next-line class-methods-use-this
    logString(text = '') {
      const newLine = document.createElement('p');
      newLine.innerText = text;
      document.getElementById('log-output').appendChild(newLine);
    }
  };
