import { Layout } from '@/components/layout/layout.component';
import { NotFound } from '@/components/screens/not-found/not-found.component';

import { $S } from '../SQuery/SQuery';
import Store from '../store/store';
import { routes } from './routes.data';

export class Router {
  #routes = routes;
  #currentRoute = '';
  #layout = null;

  constructor() {
    /**
     * handling forward and backward arrow clicks in the browser
     */
    window.addEventListener('popstate', () => {
      this.#handleRouteChange();
    });

    this.#handleRouteChange();
    this.#handleLinks();
  }

  /**
   * Setting up the work of links
   * @returns {void}
   */
  #handleLinks() {
    document.addEventListener('click', event => {
      const target = event.target.closest('a');

      if (target) {
        event.preventDefault();
        this.navigate(target.href);
      }
    });
  }

  /**
   * Get current path
   * @returns {string}
   */
  getCurrentPath() {
    return window.location.pathname;
  }

  /**
   * Navigating a given path
   * @param {string} path
   * @returns {void}
   */
  navigate(path) {
    if (path !== this.getCurrentPath()) {
      window.history.pushState({}, '', path);
      this.#handleRouteChange();
    }
  }

  /**
   * Processing a route change
   * @returns {void}
   */
  #handleRouteChange() {
    let path = this.getCurrentPath() || '/';

    const store = Store.getInstance();
    const user = store.state.user;

    if (user && path === '/auth') {
      path = '/';
    }

    let route = this.#routes.find(route => route.path === path);
    route ? null : (route = { component: NotFound });

    this.#currentRoute = route;
    this.#render();
  }

  /**
   * Render a component along the current path
   * @returns {void}
   */
  #render() {
    const component = new this.#currentRoute.component().render();

    if (!this.#layout) {
      this.#layout = new Layout({
        router: this,
        children: component
      }).render();

      $S('#app').html('').append(this.#layout);
    } else {
      $S('#content').replace(component);
    }
  }
}
