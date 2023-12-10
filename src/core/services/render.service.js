import ChildComponent from '../components/child.component';

class RenderService {
  /**
   * Transform html code into element for render
   *
   * @param {string} html
   * @param {Array} components
   * @param {Object} styles
   * @returns {HTMLElement}
   */
  htmlToElement(html, components = [], styles) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const htmlElement = doc.body.firstChild;

    styles ? this.#applyModuleStyles(styles, htmlElement) : null;

    this.#replaceComponentTags(htmlElement, components);

    return htmlElement;
  }

  /**
   * Replace component tags for render
   *
   * @param {HTMLElement} parentElement
   * @param {Array} components
   * @returns {void}
   */
  #replaceComponentTags(parentElement, components) {
    const componentTagPattern = /^component-/;
    const allElements = parentElement.getElementsByTagName('*');

    for (const element of allElements) {
      const elementTagName = element.tagName.toLowerCase();

      if (componentTagPattern.test(elementTagName)) {
        const componentName = elementTagName
          .replace('component-', '')
          .replace(/-/g, '');
        const currentComponent = components.find(Component => {
          const instance =
            Component instanceof ChildComponent ? Component : new Component();
          return instance.constructor.name.toLowerCase() === componentName;
        });

        if (currentComponent) {
          const componentContent =
            currentComponent instanceof ChildComponent
              ? currentComponent.render()
              : new currentComponent().render();
          element.replaceWith(componentContent);
        } else {
          throw new Error(
            `Component with name ${componentName} is not found in the provided components array`
          );
        }
      }
    }
  }

  /**
   * Applying module styles to an element
   *
   * @param {Object} styles - Styles object, containing styles to apply
   * @param {string} element - HTML element to which the styles will be applied
   * @returns {void}
   */
  #applyModuleStyles(styles, element) {
    if (!element) return;
    const applyStyles = element => {
      for (const [key, value] of Object.entries(styles)) {
        if (element.classList.contains(key)) {
          element.classList.remove(key);
          element.classList.add(value);
        }
      }
    };

    /**
     * Применяем стили к родиетльскому элементу, если нужно
     */
    element.getAttribute('class') ? applyStyles(element) : null;
    /**
     * Применяем стили к дочерним элементам
     */
    const allElements = element.querySelectorAll('*');
    for (const element of allElements) {
      applyStyles(element);
    }
  }
}

export default new RenderService();
