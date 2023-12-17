import { $S } from '@/core/SQuery/SQuery';
import { BaseScreen } from '@/core/components/base-screen.component';
import { FormService } from '@/core/services/form.service';
import { NotificationService } from '@/core/services/notification.service';
import RenderService from '@/core/services/render.service';
import { ValidationService } from '@/core/services/validation.service';
import Store from '@/core/store/store';

import { AuthRequiredMessage } from '@/components/ui/auth-required-message/auth-required-message.component';
import { Button } from '@/components/ui/button/button.component';
import { Field } from '@/components/ui/field/field.component';

import { ProfileService } from '@/api/profile.service';

import { PROFILE_UPDATED } from '@/constants/event.constants';

import styles from './user-profile.module.scss';
import template from './user-profile.template.html';

export class UserProfile extends BaseScreen {
  constructor() {
    super({ title: 'Profile' });

    this.formService = new FormService();
    this.profileService = new ProfileService();
    this.notificationService = new NotificationService();
    this.validationService = new ValidationService();
    this.store = Store.getInstance();
    this.user = this.store.state.user;
  }

  onUpdate() {
    this.user = this.store.state.user;
    this.#fillElements();
    document.dispatchEvent(new Event(PROFILE_UPDATED));
  }

  #fillElements() {
    $S(this.element).find('img').setAttr('src', this.user.avatarPath);
    $S(this.element).find('img').setAttr('alt', this.user.name);

    const profileInputs = $S(this.element).find('#user-profile-inputs');
    $S(this.element).find('h1').setText(this.user.name);

    profileInputs.find('input[name="name"]').setAttr('value', this.user.name);
    profileInputs.find('input[name="email"]').setAttr('value', this.user.email);
  }

  #handleSubmit(event) {
    event.preventDefault();

    if (!this.user) {
      this.notificationService.show('error', 'You must be logged in');
      return;
    }

    const formValues = this.formService.getFormValues(
      this.element.querySelector('form')
    );
    if (!this.#validateFields(formValues)) return;

    $S(event.target).setText('Saving changes...').setAttr('disabled', 'true');

    this.profileService.update(formValues, () => {
      this.onUpdate();
    });

    $S(event.target).removeAttr('disabled').setText('Save changes');
  }

  #validateFields(formValues) {
    const profileInputs = $S(this.element).find('#user-profile-inputs');

    const nameInput = profileInputs.find('input[name="name"]');
    const emailInput = profileInputs.find('input[name="email"]');
    const passwordInput = profileInputs.find('input[name="password"]');
    const confirmPasswordInput = profileInputs.find(
      'input[name="confirm-password"]'
    );

    let checkPassword = true;

    if (!formValues.name) {
      this.validationService.showError(nameInput);
    }
    if (!formValues.email) {
      this.validationService.showError(emailInput);
    }
    if (!formValues.password) {
      this.validationService.showError(passwordInput);
      this.notificationService.show(
        'error',
        'To save changes, enter the password'
      );
    }
    if (!formValues.confirmPassword) {
      this.validationService.showError(confirmPasswordInput);
      if (formValues.password) {
        this.notificationService.show(
          'error',
          'Confirm password to save changes'
        );
      }
    }

    if (formValues.password !== formValues.confirmPassword) {
      this.validationService.showError(passwordInput);
      this.validationService.showError(confirmPasswordInput);
      this.notificationService.show('error', `Passwords don't match`);
      checkPassword = false;
    }

    return (
      formValues.name &&
      formValues.email &&
      formValues.password &&
      formValues.confirmPassword &&
      checkPassword
    );
  }

  check() {
    this.user = this.store.state.user;

    if (!this.user) {
      $S(this.element)
        .setStyle('margin-top', '0')
        .setStyle('justify-content', 'flex-start');
      $S(this.element).html(new AuthRequiredMessage().render().outerHTML);
      return false;
    }

    return true;
  }

  render() {
    this.element = RenderService.htmlToElement(
      template,
      [
        new Button({
          children: 'Save changes',
          onClick: event => {
            this.#handleSubmit(event);
          }
        })
      ],
      styles
    );

    if (!this.check()) {
      return this.element;
    }

    $S(this.element).find('h1').setText(this.user.name);

    $S(this.element)
      .find('#user-profile-inputs')
      .append(
        new Field({
          label: 'Name:',
          placeholder: 'Enter your name',
          value: this.user.name,
          type: 'text',
          name: 'name'
        }).render()
      )
      .append(
        new Field({
          label: 'Email:',
          placeholder: 'Enter your email',
          value: this.user.email,
          type: 'email',
          name: 'email'
        }).render()
      )
      .append(
        new Field({
          label: 'Password:',
          placeholder: 'Enter your password',
          type: 'password',
          name: 'password'
        }).render()
      )
      .append(
        new Field({
          label: 'Confirm password:',
          placeholder: 'Confirm password',
          type: 'password',
          name: 'confirm-password'
        }).render()
      );

    $S(this.element).find('img').setAttr('src', this.user.avatarPath);

    $S(this.element).find('img').setAttr('alt', this.user.name);

    return this.element;
  }
}
