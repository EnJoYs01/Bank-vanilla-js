import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import styles from './user-info.module.scss';
import template from './user-info.template.html';

export class UserInfo extends ChildComponent {
  constructor(user) {
    super();

    if (!user) throw new Error('User should be passed');
    if (!user?.name) throw new Error('User name is required');
    if (!user?.avatarPath) throw new Error('User avatar path is required');

    this.user = user;
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

    return this.element;
  }
}
