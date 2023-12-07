import styles from '@/components/layout/notification/notification.module.scss';

import { $S } from '../SQuery/SQuery';

/**
 * Notification service is a utility class to handle displaying notifications
 * It can be used to display messages with different types: success, error. And manage the notification timeout
 */
export class NotificationService {
  #timeout;
  constructor() {
    this.#timeout = null;
  }

  /**
   * Clears the timeout object to avoid memory leaks and sets a new timer
   * @param {Function} callback - Callback function for triggering after the duration expires
   * @param {number} duration - The time before the callback function is triggered
   *  @returns {void}
   */
  #setTimeout(callback, duration) {
    this.#timeout ? clearTimeout(this.#timeout) : null;
    this.#timeout = setTimeout(callback, duration);
  }

  /**
   * Show a notification with a specified message and type
   * @param {('success' | 'error')} type - Type of the notification (only success or error accepted)
   * @param {string} message - Message to be displayed in the notification
   *  @returns {void}
   */
  show(type, message) {
    if (!['success', 'error'].includes(type)) {
      throw new Error(
        'Invalid notification type argument: only success or error allowed'
      );
    }
    if (!typeof message === 'string') {
      throw new Error('Type of message must be string');
    }

    const classNames = {
      success: styles.success,
      error: styles.error
    };
    const className = classNames[type];

    const notificationElement = $S('#notification');
    notificationElement.setText(message).addClass(className);

    this.#setTimeout(() => {
      notificationElement.removeClass(className);
    }, 3000);
  }
}
