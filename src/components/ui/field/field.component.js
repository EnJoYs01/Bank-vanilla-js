import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './field.module.scss';
import template from './field.template.html';

export class Field extends ChildComponent {
  constructor({
    placeholder,
    type = 'text',
    value = '',
    name,
    variant,
    label
  }) {
    super();

    if (!name) {
      throw new Error('Field "name" is required!');
    }

    this.placeholder = placeholder;
    this.type = type;
    this.value = value;
    this.name = name;
    this.variant = variant;
    this.label = label;
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    const inputElement = $S(this.element).find('input').input({
      name: this.name,
      type: this.type,
      placeholder: this.placeholder,
      value: this.value
    });

    this.type === 'number' ? inputElement.numberInput() : null;

    this.variant === 'credit-card' ? inputElement.creditCardInput() : null;

    this.label ? $S(this.element).find('input').before(this.label) : null;

    return this.element;
  }
}
