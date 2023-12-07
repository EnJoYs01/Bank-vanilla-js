import { UserItem } from '@/components/ui/user-item/user-item.component';
import ChildComponent from '@/core/components/child.component';
import renderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';
import Store from '@/core/store/store';

import styles from './header.module.scss';
import template from './header.template.html';

import { Logo } from './logo/logo.component';
import { LogoutButton } from './logout-button/logout-button.component';
import { Search } from './search/search.component';

export class Header extends ChildComponent {
  constructor({ router }) {
    super();

    this.store = Store.getInstance();
    this.store.addObserver(this);

    this.router = router;

    this.userItem = new UserItem({
      avatarPath: '/',
      name: 'Serge'
    });
  }

  update() {
    this.user = this.store.state.user;

    const authSideElement = $S(this.element).find('#auth-side');

    if (!this.user) {
      authSideElement.hide();
    } else {
      authSideElement.show();
      this.userItem.update(this.user);
      this.router.navigate('/');
    }
  }

  render() {
    this.element = renderService.htmlToElement(
      template,
      [Logo, Search, this.userItem, new LogoutButton({ router: this.router })],
      styles
    );

    this.update();

    return this.element;
  }
}
