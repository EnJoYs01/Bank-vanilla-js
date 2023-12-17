import { formatCardNumberWithDashes } from '@/utils/format/format-card-number';

/**
 * Class for working with DOM elements
 */
class SQuery {
  #forbiddenSymbols = /^[^!@\$%^\*_~\{\};\\?,</№]+$/;

  /**
   * Create a new SQuery instance
   * @param {string|HTMLElement} arg - CSS selector or HTMLElement
   */
  constructor(arg) {
    if (typeof arg === 'string') {
      this.element = document.querySelector(arg);

      if (!this.element) {
        throw new Error(`Element ${arg} not found!`);
      }
    } else if (arg instanceof HTMLElement) {
      this.element = arg;
    } else {
      throw new Error('Invalid arguments of constructor!');
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FINDING methods.
  |--------------------------------------------------------------------------
  */

  /**
   * Find the first element with the specified selector
   * @param {string} selector - CSS selector for finding element
   * @returns {SQuery} current SQuery instance for next work with element
   */
  find(selector) {
    if (!this.#forbiddenSymbols.test(selector)) {
      throw new Error(
        'Invalid argument: selector must not contain special characters!'
      );
    } else if (!/^[^\d]/.test(selector)) {
      throw new Error(
        'Invalid argument: the fist symbol must not be a number!'
      );
    }
    const findElement = this.element.querySelector(selector);
    if (!findElement) {
      throw new Error(`Element ${selector} not found!`);
    }
    const SQueryInstance = new SQuery(findElement);

    return SQueryInstance;
  }

  /**
   * Find all elements that match the specified selector within the selected element
   * @param {string} selector - Css selector in which the search will take place
   * @returns {SQuery[]} - Array of new SQuery instances for the found elements
   */
  findAll(selector) {
    if (!this.#forbiddenSymbols.test(selector)) {
      throw new Error(
        'Invalid argument: selector must not contain special characters!'
      );
    } else if (!/^[^\d]/.test(selector)) {
      throw new Error(
        'Invalid argument: the fist symbol must not be a number!'
      );
    }
    const elements = this.element.querySelectorAll(selector);
    if (!elements) {
      throw new Error(`Elements with ${selector} selector not found!`);
    }
    return Array.from(elements).map(element => new SQuery(element));
  }

  /*
  |--------------------------------------------------------------------------
  | INSERTING, REPLACING, DELETING html or string methods.
  |--------------------------------------------------------------------------
  */

  /**
   * Adds a child to the selected element
   * @param {HTMLElement | HTMLElement[]} child -  child to add
   * @returns {SQuery} current SQuery instance for next work with element
   */
  append(child) {
    if (child instanceof Array) {
      for (const childElement of child) {
        this.element.append(childElement);
      }
    } else {
      this.element.append(child);
    }
    return this;
  }

  /**
   * Inserting a new element before selected element
   * @param {HTMLElement | string} newElement
   * @returns {SQuery} current SQuery instance for next work with element
   */
  before(newElement) {
    if (
      !(newElement instanceof HTMLElement) &&
      typeof newElement !== 'string'
    ) {
      throw new Error('Child element must be an HTMLElement or string');
    }

    if (this.element.parentElement) {
      this.element.before(newElement);
    } else {
      throw new Error('Current element does not have a parent element');
    }
  }

  /**
   * Replaces the elements in the current node with the specified content
   * @param {HTMLElement | string } content - replacement content
   * @returns {SQuery} current SQuery instance for next work with element
   */
  replace(content) {
    const replaceableElements = this.element.querySelectorAll('*');

    for (const element of replaceableElements) {
      element.remove();
    }

    this.element.append(content);

    return this;
  }

  /**
   * Get or set the inner HTML of the selected element.
   * @param {string} [htmlContent] - Optional HTML content to set. If not provided, the current inner HTML will be returned.
   * @returns {RQuery|string} The current RQuery instance for chaining when setting HTML content, or the current inner HTML when getting.
   */
  html(htmlContent) {
    if (typeof htmlContent === 'undefined') {
      return this.element.innerHTML;
    } else {
      this.element.innerHTML = htmlContent;
      return this;
    }
  }

  /**
   * Set the text content of the selected element
   * @param {string} textContent - Text content for setting to the selected element
   * @returns {SQuery}  current SQuery instance for next work with element
   */
  setText(textContent) {
    if (typeof textContent !== 'string') {
      throw new Error('Text content must be string');
    }
    this.element.textContent = textContent;
    return this;
  }

  /**
   * Get the text content of the selected element
   * @returns {string} Text content of the selected element
   */
  getText() {
    return this.element.textContent;
  }

  /*
  |--------------------------------------------------------------------------
  | EVENTS methods.
  |--------------------------------------------------------------------------
  */

  /**
   * Add an event listener to the selected element for the specified event type
   * @param {string} eventType - The type for the event to listen
   * @param {function(event): void} callback - The event listener function to execute when the event is triggered. The function will receive the event object as its argument
   * @returns {SQuery} current SQuery instance for next work with element
   */
  on(eventType, callback) {
    if (typeof eventType !== 'string' || typeof callback !== 'function') {
      throw new Error(
        'Event type must be string and callback must be a function'
      );
    }

    this.element.addEventListener(eventType, callback);

    return this;
  }

  /**
   * Attach a click event listener to the selected element
   * @param {function (Event): void} callback - The event listener function to execute when the selected element is clicked. The function will receive the event object as its argument
   * @returns {SQuery} current SQuery instance for next work with element
   */
  click(callback) {
    if (typeof callback !== 'function' && typeof callback !== 'undefined') {
      throw new Error('Callback must be a function');
    }
    this.element.addEventListener('click', callback);
    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | FORM methods.
  |--------------------------------------------------------------------------
  */

  /**
   * Set an event listener for the submit event of a form element
   * @param {function (Event): void} onSubmit - The event listener for the form`s submit event
   * @returns {SQuery} current SQuery instance for next work with element
   */
  submit(onSubmit) {
    if (this.element.tagName.toLowerCase() !== 'form') {
      throw new Error('Selected element must be a from');
    }

    this.element.addEventListener('submit', event => {
      event.preventDefault();
      onSubmit(event);
    });

    return this;
  }

  /**
   * Set the value of an input element
   * @param {string} newValue - New value to set for the input element
   * @returns {SQuery} current SQuery instance for next work with element
   */
  setValue(newValue) {
    if (typeof newValue !== 'string' && typeof newValue !== 'undefined') {
      throw new Error('Setting value must be string');
    }

    this.element.value = newValue;

    return this;
  }

  /**
   * Get the value of an input element
   * @returns {string} Value of an input element
   */
  getValue() {
    return this.element.value;
  }

  /**
   * Set attributes and event listeners for an input element
   * @param {object} options - Object containing input options
   * @param {function(Event): void} [options.onInput] - The event listener for the input`s input event
   * @param {object} [options.rest] - Optional attributes for the input
   * @returns {SQuery} current SQuery instance for next work with element
   */
  input({ onInput, ...rest }) {
    if (this.element.tagName.toLowerCase() !== 'input') {
      throw new Error('Selected element must be an input');
    }

    for (const [key, value] of Object.entries(rest)) {
      this.element.setAttribute(key, value);
    }

    onInput ? this.element.addEventListener('input', onInput) : null;

    return this;
  }

  /**
   * Set attributes and event listeners for an number input element
   * @param {number} [limit] - Maximum length of the input value
   * @returns {SQuery} current SQuery instance for next work with element
   */
  numberInput(limit) {
    if (
      this.element.tagName.toLowerCase() !== 'input' ||
      this.element.type !== 'number'
    ) {
      throw new Error(`Selected element must be an input with type "number"`);
    }

    this.element.addEventListener('input', event => {
      let value = event.target.value;
      limit ? (value = value.slice(0, limit)) : null;
      event.target.value = value;
    });

    return this;
  }

  /**
   * Set attributes and event listeners for an number input element
   * @param {number} [limit] - Maximum length of the input value
   * @returns {SQuery} current SQuery instance for next work with element
   */
  creditCardInput() {
    if (
      this.element.tagName.toLowerCase() !== 'input' ||
      this.element.type !== 'text'
    ) {
      throw new Error(`Selected element must be an input with type "text"`);
    }

    const limit = 16;

    this.element.addEventListener('input', event => {
      let value = event.target.value.replace(/[^0-9]/g, '');

      value = value.slice(0, limit);
      event.target.value = formatCardNumberWithDashes(value);
    });

    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | STYLES methods.
  |--------------------------------------------------------------------------
  */

  /**
   * Set CSS style of the selected element
   * @param {string} property - CSS property for setting
   * @param {string} value - value of setting CSS property
   * @returns {SQuery} current SQuery instance for next work with element
   */
  setStyle(property, value) {
    if (typeof property !== 'string' || typeof value !== 'string') {
      throw new Error(
        'Invalid arguments: type of property and value must be string!'
      );
    }

    this.element.style[property] = value;
    return this;
  }

  /**
   * Adds classes to the selected element
   * @param {string | string[]} classNames - single class name or array of class names to add to the element
   * @returns {SQuery} current SQuery instance for next work with element
   */
  addClass(classNames) {
    if (classNames instanceof Array) {
      for (const className of classNames) {
        this.element.classList.add(className);
      }
    } else {
      this.element.classList.add(classNames);
    }

    return this;
  }

  /**
   * Remove classes from the selected element
   * @param {string | string[]} classNames - single class name or array of class names to remove from the element
   * @returns {SQuery} current SQuery instance for next work with element
   */
  removeClass(classNames) {
    if (classNames instanceof Array) {
      for (const className of classNames) {
        this.element.classList.remove(className);
      }
    } else {
      this.element.classList.remove(classNames);
    }

    return this;
  }

  /**
   * Set value of an attribute on the selected element
   * @param {string} attributeName - Name of the attribute to setting
   * @param {string} value - Value to set for the attribute
   * @returns {SQuery} current SQuery instance for next work with element
   */
  setAttr(attributeName, value) {
    if (typeof attributeName !== 'string' || typeof value !== 'string') {
      throw new Error(
        'Invalid arguments: type of attributeName and value must be string!'
      );
    }
    this.element.setAttribute(attributeName, value);

    return this;
  }

  /**
   * Get value of an attribute of the selected element
   * @param {string} attributeName - Name of the attribute to setting
   * @param {string} value - Value to set for the attribute
   * @returns {string} Value the attribute with specified name
   */
  getAttr(attributeName) {
    if (typeof attributeName !== 'string') {
      throw new Error(
        'Invalid argument: type of attributeName must be string!'
      );
    }
    return this.element.getAttribute(attributeName);
  }

  /**
   * Removes an attribute of the selected element
   * @param {string} attributeName - Name of the attribute to remove
   * @returns {SQuery} current SQuery instance for next work with element
   */
  removeAttr(attributeName) {
    if (typeof attributeName !== 'string') {
      throw new Error(
        'Invalid argument: type of attributeName must be string!'
      );
    }
    this.element.removeAttribute(attributeName);

    return this;
  }

  /**
   * Shows the selected element by remove display style
   * @returns {SQuery} current SQuery instance for next work with element
   */
  show() {
    this.element.style.removeProperty('display');
    return this;
  }

  /**
   * Hides the selected element by setting display style to 'none'
   * @returns {SQuery} current SQuery instance for next work with element
   */
  hide() {
    this.element.style.display = 'none';
    return this;
  }
}

/**
 * Select element from document and create a new SQuery instance
 * @param {string|HTMLElement} arg - CSS selector or HTMLElement
 */
export function $S(arg) {
  return new SQuery(arg);
}
