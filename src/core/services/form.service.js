export class FormService {
  /**
   * Retrieves the values of input elements within a form element
   * @param {HTMLFormElement} formElement - Form element with some inputs
   * @returns {object} Object containing the input element`s name as the key and its value as the value
   */
  getFormValues(formElement) {
    const allInputs = formElement.querySelectorAll('input');
    const allInputsData = {};

    for (const input of allInputs) {
      const inputName = input.name.replace(/-./g, x => x[1].toUpperCase());
      allInputsData[inputName] = input.value;
    }

    return allInputsData;
  }
}
