import { $S } from '@/core/SQuery/SQuery';
import ChildComponent from '@/core/components/child.component';
import { NotificationService } from '@/core/services/notification.service';
import RenderService from '@/core/services/render.service';
import { ValidationService } from '@/core/services/validation.service';
import Store from '@/core/store/store';

import { CardService } from '@/api/card.service';

import { Button } from '@/components/ui/button/button.component';
import { Field } from '@/components/ui/field/field.component';

import {
  BALANCE_UPDATED,
  TRANSACTION_COMPLETED
} from '@/constants/event.constants';

import styles from './transfer-field.module.scss';
import template from './transfer-field.template.html';

export const TRANSFER_FIELD_SELECTOR = '[name="card-number"]';

export class TransferField extends ChildComponent {
  constructor() {
    super();

    this.store = Store.getInstance();
    this.cardService = new CardService();
    this.notificationService = new NotificationService();
    this.validationService = new ValidationService();
  }

  handleTransfer = event => {
    event.preventDefault();

    if (!this.store.state.user) {
      this.notificationService.show('error', 'You must be logged in');
    }

    $S(event.target).setText('Sending...').setAttr('disabled', 'true');

    const inputElement = $S(this.element).find('input');
    const toCardNumber = inputElement.getValue().replaceAll('-', '');

    const reset = () => {
      $S(event.target).removeAttr('disabled').setText('Send');
    };

    if (!toCardNumber) {
      this.validationService.showError($S(this.element).find('label'));
      $S(event.target).removeAttr('disabled').setText('Send');
      return;
    }

    let amount = prompt('Transfer amount: 👇');

    this.cardService.transfer({ amount, toCardNumber }, () => {
      inputElement.setValue('');
      amount = '';

      document.dispatchEvent(new Event(TRANSACTION_COMPLETED));
      document.dispatchEvent(new Event(BALANCE_UPDATED));
    });

    reset();
  };

  render() {
    this.element = RenderService.htmlToElement(
      template,
      [
        new Field({
          name: 'card-number',
          placeholder: 'xxxx-xxxx-xxxx',
          variant: 'credit-card'
        }),
        new Button({
          children: 'Send',
          color: 'purple',
          onClick: this.handleTransfer
        })
      ],
      styles
    );

    return this.element;
  }
}
