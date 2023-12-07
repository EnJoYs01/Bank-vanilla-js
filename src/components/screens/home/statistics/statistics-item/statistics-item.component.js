import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './statistics-item.module.scss';
import template from './statistics-item.template.html';

export class StatisticsItem extends ChildComponent {
  /**
   * Constructs a StatisticItem instance.
   *
   * @param {string} label - The label to be displayed in the statistic item.
   * @param {string|number} value - The value to be displayed in the statistic item.
   * @param {('purple'|'green')} color - The color that determines the appearance of the statistic item (only 'purple' or 'green' allowed).
   */
  constructor(label, value, color) {
    super();

    if (!label || !value || !color) {
      throw new Error('Label, value and color (purple or green) required!');
    }

    this.label = label;
    this.value = value;
    this.color = color;
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    $S(this.element).addClass(styles[this.color]).addClass('fade-in');
    $S(this.element).find('#statistic-label').setText(this.label);
    $S(this.element).find('#statistic-value').setText(this.value);

    return this.element;
  }
}
