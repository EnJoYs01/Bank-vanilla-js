import { $S } from '@/core/SQuery/SQuery';
import ChildComponent from '@/core/components/child.component';
import renderService from '@/core/services/render.service';

import styles from './layout.module.scss';
import template from './layout.template.html';

import { Header } from './header/header.component';
import { Notification } from './notification/notification.component';

export class Layout extends ChildComponent {
  constructor({ router, children }) {
    super();

    this.router = router;
    this.children = children;
  }

  render() {
    this.element = renderService.htmlToElement(
      template,
      [Notification],
      styles
    );

    $S(this.element).find('#content').append(this.children);
    $S(this.element)
      .find('main')
      .before(
        new Header({
          router: this.router
        }).render()
      );

    return this.element;
  }
}
