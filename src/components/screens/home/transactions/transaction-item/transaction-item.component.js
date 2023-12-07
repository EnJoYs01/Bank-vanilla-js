import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import { formatToCurrency } from '@/utils/format/format-to-currency';
import { formatToDate } from '@/utils/format/format-to-date';

import styles from './transaction-item.module.scss';
import template from './transaction-item.template.html';

export class TransactionItem extends ChildComponent {
  constructor(transaction) {
    super();

    this.transaction = transaction;
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    const isIncome = this.transaction.type === 'TOP_UP';
    const name = isIncome ? 'Income' : 'Expense';

    isIncome ? $S(this.element).addClass(styles.income) : null;

    $S(this.element).find('#transaction-name').setText(name);

    $S(this.element)
      .find('#transaction-date')
      .setText(formatToDate(this.transaction.createdAt));

    $S(this.element)
      .find('#transaction-amount')
      .setText(formatToCurrency(this.transaction.amount));

    return this.element;
  }
}
