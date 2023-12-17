import { $S } from '@/core/SQuery/SQuery';
import { BaseScreen } from '@/core/components/base-screen.component';
import { FormService } from '@/core/services/form.service';
import renderService from '@/core/services/render.service';
import { ValidationService } from '@/core/services/validation.service';

import { Button } from '@/components/ui/button/button.component';
import { Field } from '@/components/ui/field/field.component';

import { AuthService } from '@/api/auth.service';

import styles from './auth.module.scss';
import template from './auth.template.html';

export class Auth extends BaseScreen {
  #isTypeLogin = true;

  constructor() {
    super({ title: 'Auth' });

    this.validationService = new ValidationService();
    this.formService = new FormService();
    this.authService = new AuthService();
  }

  #validateFields(formValues) {
    const authInputs = $S(this.element).find('#auth-inputs');
    const emailInput = authInputs.find('input[name="email"]');
    const passwordInput = $S(this.element).find('input[name="password"]');

    if (!formValues.email) {
      this.validationService.showError(emailInput);
    }
    if (!formValues.password) {
      this.validationService.showError(passwordInput);
    }

    return formValues.email && formValues.password;
  }

  #handleSubmit = event => {
    const formValues = this.formService.getFormValues(event.target);
    if (!this.#validateFields(formValues)) return;

    this.authService.main(this.#isTypeLogin ? 'login' : 'register', formValues);
  };

  #changeFormType = event => {
    event.preventDefault();

    $S(this.element)
      .find('h1')
      .setText(this.#isTypeLogin ? 'Register' : 'Sing in');

    $S(event.target).setText(this.#isTypeLogin ? 'Sing in' : 'Register');

    this.#isTypeLogin = !this.#isTypeLogin;
  };

  render() {
    this.element = renderService.htmlToElement(
      template,
      [
        new Button({
          children: 'Submit'
        })
      ],
      styles
    );

    $S(this.element)
      .find('#auth-inputs')
      .append(
        new Field({
          placeholder: 'Enter email',
          type: 'email',
          name: 'email'
        }).render()
      )
      .append(
        new Field({
          placeholder: 'Enter password',
          type: 'password',
          name: 'password'
        }).render()
      );

    $S(this.element).find('#change-form-type').click(this.#changeFormType);

    $S(this.element).find('form').submit(this.#handleSubmit);

    return this.element;
  }
}
