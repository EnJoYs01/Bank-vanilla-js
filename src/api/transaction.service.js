import { MyQuery } from '@/core/my-query/my-query.lib';

export class TransactionService {
  #BSE_URL = '/transactions';

  /**
   * Get all transactions
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  getAllTransactions(onSuccess) {
    return MyQuery({
      path:
        this.#BSE_URL +
        `?${new URLSearchParams({
          orderBy: 'desc'
        })}`,
      onSuccess
    });
  }
}
