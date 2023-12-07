import { $S } from '@/core/SQuery/SQuery';
import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import Store from '@/core/store/store';

import { UserService } from '@/api/user.service';

import { Heading } from '@/components/ui/heading/heading.component';
import {
  LOADER_SELECTOR,
  Loader
} from '@/components/ui/loader/loader.component';

import { UserItem } from '@/components/ui/user-item/user-item.component';

import { formatCardNumberWithDashes } from '@/utils/format/format-card-number';

import styles from './contacts.module.scss';
import template from './contacts.template.html';
import {
  TRANSFER_FIELD_SELECTOR,
  TransferField
} from './transfer-field/transfer-field.component';

export class Contacts extends ChildComponent {
  constructor() {
    super();

    this.store = Store.getInstance();
    this.userService = new UserService();
  }

  fetchData() {
    this.userService.getAllUsersBySearchTerm(null, data => {
      if (!data) return;

      this.element.querySelector(LOADER_SELECTOR).remove();

      for (const user of data) {
        $S(this.element)
          .find('#contacts-list')
          .append(
            new UserItem(user, true, () => {
              $S(TRANSFER_FIELD_SELECTOR).setValue(
                formatCardNumberWithDashes(user.card.number)
              );
            }).render()
          );
      }

      $S(this.element)
        .find('#contacts-list')
        .findAll('button')
        .forEach(contactElement => {
          contactElement.addClass('fade-in');
        });
    });
  }

  render() {
    this.element = RenderService.htmlToElement(
      template,
      [TransferField, new Heading('Transfer money')],
      styles
    );

    if (this.store.state.user) {
      $S(this.element)
        .find('#contacts-list')
        .html(new Loader().render().outerHTML);

      setTimeout(() => {
        this.fetchData();
      }, 500);
    }

    return this.element;
  }
}
