import { $S } from '@/core/SQuery/SQuery';
import ChildComponent from '@/core/components/child.component';
import renderService from '@/core/services/render.service';
import Store from '@/core/store/store';

import { StatisticService } from '@/api/statistic.service';

import { Heading } from '@/components/ui/heading/heading.component';
import {
  LOADER_SELECTOR,
  Loader
} from '@/components/ui/loader/loader.component';

import { TRANSACTION_COMPLETED } from '@/constants/event.constants';

import { formatToCurrency } from '@/utils/format/format-to-currency';

import { CircleChart } from './circle-chart/circle-chart.component';
import { StatisticsItem } from './statistics-item/statistics-item.component';
import styles from './statistics.module.scss';
import template from './statistics.template.html';

export class Statistics extends ChildComponent {
  constructor() {
    super();
    this.store = Store.getInstance();
    this.statisticService = new StatisticService();

    this.element = renderService.htmlToElement(
      template,
      [new Heading('Statistics')],
      styles
    );

    this.#addListeners();
  }

  #addListeners() {
    document.addEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted.bind(this)
    );
  }

  #removeListeners() {
    document.removeEventListener(
      TRANSACTION_COMPLETED,
      this.#onTransactionCompleted.bind(this)
    );
  }

  #onTransactionCompleted() {
    this.fetchData();
  }

  destroy() {
    this.#removeListeners();
  }

  renderChart(income, expense) {
    const total = income + expense;
    let incomePercent = (income * 100) / total;
    let expensePercent = 100 - incomePercent;

    if (income && !expense) {
      incomePercent = 100;
      expensePercent = 0.1;
    }

    if (expense && !income) {
      incomePercent = 0.1;
      expensePercent = 100;
    }

    return new CircleChart(incomePercent, expensePercent).render();
  }

  fetchData() {
    this.statisticService.main(data => {
      if (!data) return;

      const loaderElement = this.element.querySelector(LOADER_SELECTOR);
      loaderElement ? loaderElement.remove() : null;

      const statisticsItemsElement = $S(this.element).find('#statistics-items');
      statisticsItemsElement.setText('');

      const circleChartElement = $S(this.element).find('#circle-chart');
      circleChartElement.setText('');

      statisticsItemsElement
        .append(
          new StatisticsItem(
            'Income:',
            formatToCurrency(data[0].value || 0),
            'green'
          ).render()
        )
        .append(
          new StatisticsItem(
            'Expense:',
            formatToCurrency(data[1].value),
            'purple'
          ).render()
        );

      circleChartElement.append(this.renderChart(data[0].value, data[1].value));
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
