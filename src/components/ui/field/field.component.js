import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './field.module.scss';
import template from './field.template.html';

export class Field extends ChildComponent {
  constructor({ placeholder, type = 'text', value = '', name, variant }) {
    super();

    if (!name) {
      throw new Error('Field "name" is required!');
    }

    this.placeholder = placeholder;
    this.type = type;
    this.value = value;
    this.name = name;
    this.variant = variant;
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

    return this.element;
  }
}
