import { $S } from '@/core/SQuery/SQuery';
import ChildComponent from '@/core/components/child.component';
import { NotificationService } from '@/core/services/notification.service';
import RenderService from '@/core/services/render.service';
import { ValidationService } from '@/core/services/validation.service';
import Store from '@/core/store/store';

import { CardService } from '@/api/card.service';

import { Button } from '@/components/ui/button/button.component';
import { Field } from '@/components/ui/field/field.component';

import { BALANCE_UPDATED } from '@/constants/event.constants';
import styles from './actions.module.scss';
import template from './actions.template.html';

export class Actions extends ChildComponent {
  constructor() {
    super();

    this.validationService = new ValidationService();
    this.store = Store.getInstance();
    this.cardService = new CardService();
    this.notificationService = new NotificationService();
  }

  /**
   * Update card balance
   * @param {Event} event - Event object from the button click event
   * @param {'top-up' | 'withdrawal'} type - Type of the transaction(only 'top-up' or 'withdrawal' allowed)
   */
  updateBalance(event, type) {
    event.preventDefault();
    if (!this.store.state.user) {
      this.notificationService.show('error', 'You must be logged in');
      return;
    }

    $S(event.target).setText('Sending...').setAttr('disabled', 'true');

    const inputElement = $S(this.element).find('input');
    const amount = inputElement.getValue();

    if (!amount) {
      this.validationService.showError($S(this.element).find('label'));
      $S(event.target).removeAttr('disabled').setText(type);
      return;
    }

    this.cardService.updateBalance(amount, type, () => {
      inputElement.setValue('');

      const balanceUpdatedEvent = new Event(BALANCE_UPDATED);
      document.dispatchEvent(balanceUpdatedEvent);
    });

    $S(event.target).removeAttr('disabled').setText(type);
  }

  render() {
    this.element = RenderService.htmlToElement(
      template,
      [
        new Field({
          name: 'amount',
          placeholder: 'Enter amount',
          type: 'number'
        })
      ],
      styles
    );

    $S(this.element)
      .find('#action-buttons')
      .append(
        new Button({
          children: 'Top-up',
          color: 'green',
          onClick: event => {
            this.updateBalance(event, 'top-up');
          }
        }).render()
      )
      .append(
        new Button({
          children: 'Withdrawal',
          color: 'purple',
          onClick: event => {
            this.updateBalance(event, 'withdrawal');
          }
        }).render()
      );

    return this.element;
  }
}
