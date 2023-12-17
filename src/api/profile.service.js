import { MyQuery } from '@/core/my-query/my-query.lib';
import { NotificationService } from '@/core/services/notification.service';
import Store from '@/core/store/store';

export class ProfileService {
  #BASE_URL = '/users/profile';

  constructor() {
    this.store = Store.getInstance();
    this.notificationService = new NotificationService();
  }

  /**
   * Update user profile
   * @param {object} body - Profile update options
   * @param {string} body.name - New profile name
   * @param {string} body.email - New profile email
   * @param {string} body.password - New profile password
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  update({ name, email, password }, onSuccess) {
    console.log('name =' + name, 'email =' + email, 'password = ' + password);
    return MyQuery({
      method: 'PUT',
      path: this.#BASE_URL,
      body: {
        name: name,
        email: email,
        password: password
      },
      onSuccess: data => {
        console.log('data email\n');
        console.log(data.email);
        this.store.updateUser(data);

        this.notificationService.show(
          'success',
          'Your account has been successfully updated'
        );

        onSuccess();
      }
    });
  }

  /**
   * Get user profile
   * @returns {Promise} Promise object that resolves to the response from the API
   * @returns {void}
   */
  get() {
    return MyQuery({
      path: this.#BASE_URL,
      onSuccess
    });
  }
}
