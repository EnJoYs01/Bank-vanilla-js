import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';

import styles from './auth-required-message.module.scss';
import template from './auth-required-message.template.html';

export class AuthRequiredMessage extends ChildComponent {
  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    return this.element;
  }
}
