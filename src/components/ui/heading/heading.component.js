import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './heading.module.scss';
import template from './heading.template.html';

export class Heading extends ChildComponent {
  constructor(title = '') {
    super();

    this.title = title;
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    $S(this.element).setText(this.title);

    return this.element;
  }
}
