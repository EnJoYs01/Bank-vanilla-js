/**
 * Format a credit card number by adding dashes (-) after every 4th symbols
 * @param {string} cardNumber - The credit card number for formatting
 * @returns {string} Formatted credit card number
 */
export function formatCardNumberWithDashes(cardNumber) {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1-');
}

/**
 * Format a credit card number into the format **** **** **** ****
 * @param {string} cardNumber - The credit card number for formatting
 * @returns {string} Formatted credit card number
 */
export function formatCardNumber(cardNumber) {
  /**
   * Remove all spaces and split string for groups of 4 characters
   */
  const formattedCardNumber = cardNumber.replace(/\s/g, '').match(/.{1,4}/g);

  /**
   * Combining groups in string with spaces between these groups
   */
  return formattedCardNumber ? formattedCardNumber.join(' ') : '';
}
