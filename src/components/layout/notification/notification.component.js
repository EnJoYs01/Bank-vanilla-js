import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';

import styles from './notification.module.scss';
import template from './notification.template.html';

export class Notification extends ChildComponent {
  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    return this.element;
  }
}
