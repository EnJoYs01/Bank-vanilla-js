import { MyQuery } from '@/core/my-query/my-query.lib';
import { NotificationService } from '@/core/services/notification.service';
import Store from '@/core/store/store';

export class AuthService {
  #BASE_URL = '/auth';

  constructor() {
    this.store = Store.getInstance();
    this.notificationService = new NotificationService();
  }

  /**
   * Login or register user depending on the current type
   * @param {string} type - Type of operation (only login or register allowed)
   * @param {any} body - Password and email for login or register
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  main(type, body) {
    const currentType =
      type === 'register' ? 'register' : type === 'login' ? 'login' : null;
    if (!type) {
      throw new Error('Operation type must be "register" or "login"');
    }
    return MyQuery({
      path: `${this.#BASE_URL}/${currentType}`,
      body,
      onSuccess: data => {
        console.log(data);
        this.store.login(data.user, data.accessToken);

        this.notificationService.show(
          'success',
          type === 'register'
            ? 'You have successfully registered'
            : 'You have successfully logged in'
        );
      },
      method: 'POST'
    });
  }
}
