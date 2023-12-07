import { BaseScreen } from '@/core/components/base-screen.component';
import RenderService from '@/core/services/render.service';

import { Heading } from '@/components/ui/heading/heading.component';
import styles from './not-found.module.scss';
import template from './not-found.template.html';

export class NotFound extends BaseScreen {
  constructor() {
    super({ title: 'Not Found' });
  }

  render() {
    this.element = RenderService.htmlToElement(
      template,
      [new Heading('Page not found!')],
      styles
    );

    return this.element;
  }
}
