import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';

import template from './loader.template.html';

export const LOADER_SELECTOR = '[data-component = "loader"]';

export class Loader extends ChildComponent {
  constructor(width = 100, height = 100) {
    super();

    this.width = width;
    this.height = height;
  }

  render() {
    this.element = RenderService.htmlToElement(template, []);

    this.element.style = `width: ${this.width}px; height: ${this.width}px`;
    this.element.classList.add('bounce');

    return this.element;
  }
}
