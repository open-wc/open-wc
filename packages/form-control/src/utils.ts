/**
 * Implicitly submit a form by first validating all controls. If the form
 * is valid, issue a submit event and if that event is not prevented, manually
 * call the form's submit method.
 *
 * @param form {HTMLFormElement} - A form to implicitly submit
 */
 export const submit = (form: HTMLFormElement): void => {
    if (!form.reportValidity()) {
      return;
    } else {
      const submitEvent = new Event('submit', {
        cancelable: true
      });
      form.dispatchEvent(submitEvent);
      if (!submitEvent.defaultPrevented) {
        form.submit();
      }
    }
  };
  
  /**
   * Parse a form and return a set of values based on the name/value pair.
   * If multiple controls of a similar name exist, return an array for those values;
   * otherwise return a single value.
   *
   * @param form {HTMLFormElement} - The form to parse for values
   * @returns {Object<string, any>} - An object representing the form's current values
   */
  export const formValues = (form: HTMLFormElement): Record<string, any> => {
    const formData = new FormData(form);
    const values = {};
  
    // @ts-ignore This exists, TypeScript is wrong
    for (let [key, value] of formData.entries()) {
      if (!values.hasOwnProperty(key)) {
        values[key] = value;
      } else if (Array.isArray(values[key])) {
        values[key].push(value);
      } else {
        values[key] = [values[key], value];
      }
    }
    return values;
  };
  
  /**
   * This method takes a form and parses it as an object. If any form control has a `.`
   * in its name, this utility will evaluate that name as a deep key for an object;
   * in other words, if a form has a named control, `name.first` and another, `name.last`
   * it will report back a nested object, name, with first and last properties
   * representing those controls' values.
   *
   * This can be useful when you have a complex model that you are attempting to represent
   * in declaratively in HTML.
   *
   * @param form {HTMLFormElement} - The form to grab values from
   * @returns {Object<any, any>} - An object representation of the form
   */
  export const parseFormAsObject = (form: HTMLFormElement): Record<any, any> => {
    const data = formValues(form);
    const output = {};
  
    Object.entries(data).forEach(([key, value]) => {
      /** If the key has a '.', parse it as an object */
      if (key.includes('.')) {
        const path = key.split('.');
        const destination = path.pop();
        let pointer = output;
  
        while (path.length) {
          const key = path.shift();
          pointer[key] = pointer[key] || {};
          pointer = pointer[key];
        }
  
        pointer[destination] = value;
      } else {
        output[key] = data[key];
      }
    });
  
    return output;
  };
  