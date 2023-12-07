import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';
import Store from '@/core/store/store';

import { TransactionService } from '@/api/transaction.service';

import { Heading } from '@/components/ui/heading/heading.component';

import { TRANSACTION_COMPLETED } from '@/constants/event.constants';

import {
  Loader,
  LOADER_SELECTOR
} from '@/components/ui/loader/loader.component';

import { TransactionItem } from './transaction-item/transaction-item.component';
import styles from './transactions.module.scss';
import template from './transactions.template.html';

export class Transactions extends ChildComponent {
  constructor() {
    super();

    this.store = Store.getInstance();
    this.transactionService = new TransactionService();

    this.element = RenderService.htmlToElement(
      template,
      [new Heading('Recent transactions')],
      styles
    );

    this.#addListeners();
  }

  #addListeners() {
    document.addEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted
    );
  }

  #removeListeners() {
    document.removeEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted
    );
  }

  #onTransactionCompleted = () => {
    this.fetchData();
  };

  destroy() {
    this.#removeListeners();
  }

  fetchData() {
    this.transactionService.getAllTransactions(data => {
      if (!data) return;

      const loaderElement = this.element.querySelector(LOADER_SELECTOR);
      loaderElement ? loaderElement.remove() : null;

      const transactionsList = $S(this.element).find('#transactions-list');
      transactionsList.setText('');

      if (data.length) {
        for (const transaction of data.transactions) {
          transactionsList.append(new TransactionItem(transaction).render());
        }
      } else {
        transactionsList.setText('Transactions not found');
      }
    });
  }

  render() {
    if (this.store.state.user) {
      $S(this.element).append(new Loader().render());
      setTimeout(() => {
        this.fetchData();
      }, 500);
    }

    return this.element;
  }
}
