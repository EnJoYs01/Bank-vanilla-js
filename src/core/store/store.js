import { ACCESS_TOKEN_KEY, USER_STORAGE_KEY } from '@/constants/auth.constants';
import { StorageService } from '../services/storage.service';

/**
 * Store class implements the Singleton pattern, providing a centralized storage and state management solution.
 * It manages user login/logout and notifies observers of any changes in the state.
 */
export default class Store {
  constructor(initialState) {
    this.observers = [];

    this.storageService = new StorageService();
    const savedUser = this.storageService.getItem(USER_STORAGE_KEY);

    const state = savedUser ? { user: savedUser } : initialState;

    this.state = new Proxy(state, {
      set: (target, property, value) => {
        target[property] = value;

        this.notify();
        return true;
      }
    });
  }

  /**
   * Get the singleton instance of the Store
   * @returns {Store} Singleton instance of the Store
   */
  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store({ user: null });
    }

    return Store.instance;
  }

  /**
   * Add new observer to the store`s list of observers
   * @param {object} observer - Observer object to add
   * @returns {void}
   */
  addObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * Remove observer from the store`s list of observers
   * @param {object} observer - Observer object to remove
   * @returns {void}
   */
  removeObserver(observer) {
    this.observers = this.observers.filter(
      currentObserver => currentObserver !== observer
    );
  }

  /**
   * Notifies all observers of store changes
   * @returns {void}
   */
  notify() {
    for (const observer of this.observers) {
      observer.update();
    }
  }

  /**
   * Log in current user, update the state and storage service
   * @param {object} user - User object for log in
   * @param {string} accessToken - Token to verify login
   * @returns {void}
   */
  login(user, accessToken) {
    this.state.user = user;
    this.storageService.setItem(USER_STORAGE_KEY, user);
    this.storageService.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  /**
   * Log out current user, update the state and remove user from the storage service
   * @returns {void}
   */
  logout() {
    this.state.user = null;
    this.storageService.removeItem(USER_STORAGE_KEY);
    this.storageService.removeItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Update user card
   * @param {object} card - Card for update
   * @returns {void}
   */
  updateCard(card) {
    const oldUser = this.state.user;
    const newUser = { ...oldUser, card };
    this.state.user = newUser;
    this.storageService.setItem(USER_STORAGE_KEY, newUser);
  }
}
