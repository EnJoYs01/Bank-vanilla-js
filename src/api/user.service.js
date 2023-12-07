import { MyQuery } from '@/core/my-query/my-query.lib';

export class UserService {
  #BASE_URL = '/users';

  /**
   * Get all users by search term or get all users
   * @param {string} searchTerm - Search query to get specific users
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  getAllUsersBySearchTerm(searchTerm, onSuccess) {
    return MyQuery({
      path:
        this.#BASE_URL +
        `${
          searchTerm
            ? `?${new URLSearchParams({
                searchTerm
              })}`
            : ''
        }`,
      onSuccess
    });
  }
}
