import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './button.module.scss';
import template from './button.template.html';

export class Button extends ChildComponent {
  constructor({ children, onClick, color }) {
    super();
    if (!children) {
      throw new Error('Children is empty!');
    }

    this.children = children;
    this.onClick = onClick;
    this.color = color;
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    $S(this.element).replace(this.children).click(this.onClick);

    this.color ? $S(this.element).addClass(styles[this.color]) : null;

    return this.element;
  }
}
