/**
 * StorageService is a class that provides an interface for working with localStorage in a more convenient and structured way
 */
export class StorageService {
  /**
   * Saves an item in localStorage with the provided key and value
   * @param {string} key - The key under witch the value will be
   * @param {any} value - The value to be stored
   * @returns {void}
   */
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Removes an item from local storage by the provided key
   * @param {string} key
   * @returns {void}
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Retrieves an item from local storage by the provided key
   * @param {string} key - The key of the item to be retrieved
   * @returns {any} The value of the item or null if item doesn`t exist
   */
  getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Clears all data from localStorage
   * @returns {void}
   */
  clear() {
    localStorage.clear();
  }
}
