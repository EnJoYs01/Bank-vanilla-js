import ChildComponent from '@/core/components/child.component';
import renderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';
import Store from '@/core/store/store';

import styles from './header.module.scss';
import template from './header.template.html';

import { PROFILE_UPDATED } from '@/constants/event.constants';
import { Logo } from './logo/logo.component';
import { LogoutButton } from './logout-button/logout-button.component';
import { Search } from './search/search.component';
import { UserInfo } from './user-info/user-info.component';

export class Header extends ChildComponent {
  constructor({ router }) {
    super();

    this.store = Store.getInstance();
    this.store.addObserver(this);

    this.router = router;

    this.userInfo = new UserInfo({
      avatarPath: '/',
      name: 'Serge'
    });
    // this.userItem = new UserItem({
    //   avatarPath: '/',
    //   name: 'Serge'
    // });

    this.#addListeners();
  }

  #addListeners() {
    document.addEventListener(PROFILE_UPDATED, this.update.bind(this));
  }

  #removeListeners() {
    document.removeEventListener(PROFILE_UPDATED, this.update.bind(this));
  }

  #destroy() {
    this.#removeListeners();
  }

  checkUserInfo() {
    if (this.userInfo.name !== 'Serge') {
      this.#destroy();
      return true;
    }
    return false;
  }

  update() {
    this.user = this.store.state.user;

    const authSideElement = $S(this.element).find('#auth-side');

    if (!this.user) {
      authSideElement.hide();
    } else {
      authSideElement.show();
      this.userInfo.update(this.user);

      if (this.router.getCurrentPath() === '/auth') {
        this.router.navigate('/');
      }
    }
  }

  render() {
    this.checkUserInfo();
    this.element = renderService.htmlToElement(
      template,
      [Logo, Search, this.userInfo, new LogoutButton({ router: this.router })],
      styles
    );

    this.update();

    return this.element;
  }
}
