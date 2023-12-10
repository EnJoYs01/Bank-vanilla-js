import { MyQuery } from '@/core/my-query/my-query.lib';
import { NotificationService } from '@/core/services/notification.service';
import Store from '@/core/store/store';

export class CardService {
  #BASE_URL = '/cards';

  constructor() {
    this.store = Store.getInstance();
    this.notificationService = new NotificationService();
  }

  /**
   * Get cards by user
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  getCardByUser(onSuccess) {
    return MyQuery({
      path: `${this.#BASE_URL}/by-user`,
      onSuccess
    });
  }

  /**
   * Updates the user`s balance with the specified amount and type of operation
   * @param {number} amount - Amount to be added or withdrawn from the user`s card balance
   * @param {'top-up' | 'withdrawal'} type - Type of the operation (only 'top-up' or 'withdrawal' allowed)
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  updateBalance(amount, type, onSuccess) {
    if (!+amount) {
      throw new Error('The wrong amount was entered. Amount must be number');
    }
    const currentType =
      type === 'top-up'
        ? 'top-up'
        : type === 'withdrawal'
          ? 'withdrawal'
          : null;

    if (!currentType) {
      throw new Error('Operation type must be "top-up" or "withdrawal"');
    }

    return MyQuery({
      path: `${this.#BASE_URL}/balance/${type}`,
      method: 'PATCH',
      body: { amount: +amount },
      onSuccess: () => {
        this.notificationService.show(
          'success',
          currentType === 'top-up'
            ? `Your balance has been successfully topped up by ${amount} rubles`
            : `You have successfully withdrawn ${amount} rubles from your card balance`
        );
        onSuccess();
      }
    });
  }

  /**
   * Transfers money between two cards
   * @param {object} body - Transfer options details
   * @param {number} body.amount - Amount to be transferred
   * @param {string} body.toCardNumber - Recipient`s card number
   * @param {Function} onSuccess - Callback function that will be executed in case of a successful response
   * @returns {Promise} Promise object that resolves to the response from the API
   */
  transfer({ amount, toCardNumber }, onSuccess) {
    return MyQuery({
      path: `${this.#BASE_URL}/transfer-money`,
      method: 'PATCH',
      body: {
        amount: +amount,
        fromCardNumber: this.store.state.user.card.number,
        toCardNumber
      },
      onSuccess: () => {
        this.notificationService.show(
          'success',
          'Transfer money successfully completed'
        );

        onSuccess();
      }
    });
  }
}
