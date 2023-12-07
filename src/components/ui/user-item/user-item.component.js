import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './user-item.module.scss';
import template from './user-item.template.html';

export class UserItem extends ChildComponent {
  constructor(user, isGray = false, onClick) {
    super();

    if (!user) throw new Error('User should be passed');
    if (!user?.name) throw new Error('User name is required');
    if (!user?.avatarPath) throw new Error('User avatar path is required');

    this.user = user;
    this.isGray = isGray;
    this.onClick = onClick;
  }

  #preventDefault(event) {
    event.preventDefault();
  }

  update({ avatarPath, name }) {
    if (avatarPath && name) {
      $S(this.element)
        .find('img')
        .setAttr('src', avatarPath)
        .setAttr('alt', name);

      $S(this.element).find('span').setText(name);
    }
  }

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    this.update(this.user);

    $S(this.element).click(this.onClick || this.#preventDefault.bind(this));

    this.onClick ? null : $S(this.element).setAttr('disabled', '');
    !this.isGray ? null : $S(this.element).addClass(styles.gray);

    return this.element;
  }
}
